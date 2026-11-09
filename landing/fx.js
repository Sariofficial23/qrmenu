// Кинематографичный слой: заголовки по словам, параллакс, счётчики, прожектор карточек, магнитные кнопки.
// Всё отключается при prefers-reduced-motion. Подключается до main.js, вызывается из него (FX.init / FX.refresh).
(function () {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---------- Заголовки: маска + подъём слов ---------- */
  function splitNode(node, counter) {
    Array.from(node.childNodes).forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/([ \t\n\r]+)/).forEach((p) => {
          if (!p) return;
          if (/^[ \t\n\r]+$/.test(p)) { frag.appendChild(document.createTextNode(" ")); return; }
          const kw = document.createElement("span");
          const ki = document.createElement("span");
          kw.className = "kw"; ki.className = "ki";
          ki.style.setProperty("--i", counter.n++);
          ki.textContent = p;
          kw.appendChild(ki);
          frag.appendChild(kw);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1) splitNode(n, counter);
    });
  }

  // Градиент на словах: общий для всего заголовка, чтобы цвет шёл плавно слева направо
  function paintGradients(h) {
    const hr = h.getBoundingClientRect();
    $$(".grad .ki", h).forEach((ki) => {
      const r = ki.parentElement.getBoundingClientRect();
      ki.style.setProperty("--gw", Math.round(hr.width) + "px");
      ki.style.setProperty("--gx", Math.round(hr.left - r.left) + "px");
    });
  }

  function kinetic() {
    $$("h1,h2").forEach((h) => {
      if (!h.classList.contains("reveal")) h.classList.add("reveal"); // чтобы main.js включил анимацию при появлении в кадре
      const seen = h.classList.contains("in");
      h.classList.remove("kin");
      splitNode(h, { n: 0 });
      h.classList.add("kin");
      paintGradients(h);
      if (reduce) { h.classList.add("in"); return; }
      if (seen) { h.classList.remove("in"); requestAnimationFrame(() => requestAnimationFrame(() => h.classList.add("in"))); }
    });
  }

  /* ---------- Счётчики в блоке цифр ---------- */
  function counters() {
    $$(".fact b").forEach((b) => {
      const m = /^(\d+)(\D*)$/.exec(b.textContent.trim());
      if (!m || b.dataset.cnt) return;
      b.dataset.cnt = "1";
      const to = +m[1], suf = m[2];
      if (reduce) return;
      b.textContent = "0" + suf;
      const io = new IntersectionObserver((es) => es.forEach((e) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now(), dur = 1500;
        const tick = (t) => {
          const k = Math.min((t - t0) / dur, 1);
          const v = 1 - Math.pow(1 - k, 4);
          b.textContent = Math.round(to * v) + suf;
          if (k < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }), { threshold: 0.6 });
      io.observe(b);
    });
  }

  /* ---------- Параллакс фото ---------- */
  const layers = [];
  function collectLayers() {
    layers.length = 0;
    [[".hero__bg img", 0.16], [".rest__bg img", 0.1]].forEach(([sel, k]) => {
      const img = document.querySelector(sel);
      if (img) layers.push({ img, box: img.closest(".hero,.rest"), k });
    });
  }
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      const vh = innerHeight;
      layers.forEach(({ img, box, k }) => {
        const r = box.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) return;
        img.style.setProperty("--py", (-r.top * k).toFixed(1) + "px");
      });
      if (bar) bar.style.transform = "scaleX(" + Math.min(scrollY / Math.max(document.documentElement.scrollHeight - vh, 1), 1) + ")";
    });
  }

  /* ---------- Прожектор на карточках ---------- */
  const SPOT = ".fact,.card,.feat__item,.steps li,.faq details,.lead-card";
  function spotlight(e) {
    const t = e.target.closest && e.target.closest(SPOT);
    if (!t) return;
    const r = t.getBoundingClientRect();
    t.style.setProperty("--mx", e.clientX - r.left + "px");
    t.style.setProperty("--my", e.clientY - r.top + "px");
  }

  /* ---------- Магнитные кнопки ---------- */
  function magnet() {
    $$(".btn--primary,.btn--call").forEach((b) => {
      if (b.dataset.mag) return;
      b.dataset.mag = "1";
      b.addEventListener("pointermove", (e) => {
        const r = b.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
        const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
        b.style.transform = "translate(" + (dx * 10).toFixed(1) + "px," + (dy * 8).toFixed(1) + "px)";
      });
      b.addEventListener("pointerleave", () => { b.style.transform = ""; });
    });
  }

  let bar = null, inited = false;
  function init() {
    if (inited) return;
    inited = true;
    bar = document.createElement("div");
    bar.className = "fx-progress";
    bar.setAttribute("aria-hidden", "true");
    document.body.appendChild(bar);
    collectLayers();
    window.addEventListener("scroll", onScroll, { passive: true });
    let rt;
    window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { $$("h1.kin,h2.kin").forEach(paintGradients); onScroll(); }, 150); });
    if (fine && !reduce) document.addEventListener("pointermove", spotlight, { passive: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => $$("h1.kin,h2.kin").forEach(paintGradients));
    onScroll();
  }

  function refresh() {
    kinetic();
    counters();
    if (fine && !reduce) magnet();
    collectLayers();
    onScroll();
  }

  window.FX = { init, refresh };
})();
