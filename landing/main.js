(function () {
  const S = window.SITE || {};
  const T = window.I18N;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };

  // Язык: узбекский по умолчанию, выбор запоминается
  let lang = "uz";
  try { const saved = localStorage.getItem("lang"); if (saved === "ru" || saved === "uz") lang = saved; } catch (e) {}
  const t = (k) => T[lang][k] ?? T.uz[k] ?? "";

  // Контакты из config.js
  const ig = "https://instagram.com/" + S.instagram;
  const tg = "https://t.me/" + S.telegram;
  $$("[data-brand]").forEach((e) => (e.textContent = S.brand));
  $$("[data-ig-link]").forEach((e) => (e.href = ig));
  $$("[data-ig-handle]").forEach((e) => (e.textContent = "@" + S.instagram));
  $$("[data-tg-link]").forEach((e) => (e.href = tg));
  $$("[data-tg-handle]").forEach((e) => (e.textContent = "@" + S.telegram));
  $$("[data-phone]").forEach((e) => (e.textContent = S.phone));
  $$("[data-phone-link]").forEach((e) => (e.href = "tel:" + String(S.phone).replace(/[^\d+]/g, "")));
  $("#year").textContent = new Date().getFullYear();

  // Цифры
  function renderStats() {
    const box = $("#stats");
    box.innerHTML = "";
    (S.stats || []).forEach((s) => {
      const f = el("div", "fact reveal in");
      f.append(el("b", "", s.n), el("span", "", s[lang] || s.uz));
      box.appendChild(f);
    });
  }

  // Работы
  const ICON = { bot: "i-truck", site: "i-web" };
  const COVER = { site: ["d", "c"], bot: ["a", "b"] };
  function renderWorks() {
    const box = $("#works");
    box.innerHTML = "";
    const seen = {};
    (S.projects || []).forEach((p) => {
      const n = (seen[p.type] = (seen[p.type] || 0) + 1) - 1;
      const set = COVER[p.type] || COVER.bot;
      const w = el(p.url ? "a" : "article", "work reveal in");
      if (p.url) { w.href = p.url; w.target = "_blank"; w.rel = "noopener"; }
      const cover = el("div", "work__cover work__cover--" + set[n % set.length]);
      if (p.img) {
        const im = el("img"); im.src = p.img; im.alt = p.title[lang] || p.title.uz; im.loading = "lazy";
        cover.appendChild(im);
      } else {
        cover.innerHTML = `<svg><use href="#${ICON[p.type] || "i-spark"}"/></svg>`;
      }
      w.append(cover, el("span", "tag", t("work.tag." + p.type)), el("h4", "", p.title[lang] || p.title.uz), el("p", "", p.desc[lang] || p.desc.uz));
      if (p.url) {
        const l = el("span", "work__link", t("work.open") + " ");
        l.insertAdjacentHTML("beforeend", '<svg><use href="#i-arrow"/></svg>');
        w.appendChild(l);
      }
      box.appendChild(w);
    });
  }

  function applyLang(next) {
    lang = next;
    try { localStorage.setItem("lang", lang); } catch (e) {}
    document.documentElement.lang = lang;
    document.title = t("meta.title").replace("{brand}", S.brand);
    $('meta[name="description"]').content = t("meta.desc");
    $$("[data-t]").forEach((e) => (e.innerHTML = t(e.dataset.t)));
    $$("[data-tp]").forEach((e) => (e.placeholder = t(e.dataset.tp)));
    $$("[data-city]").forEach((e) => (e.textContent = (S.city && (S.city[lang] || S.city.uz)) || ""));
    $$("[data-lang]").forEach((b) => { b.classList.toggle("on", b.dataset.lang === lang); b.setAttribute("aria-pressed", b.dataset.lang === lang); });
    renderStats();
    renderWorks();
    restartChat();
  }
  $$("[data-lang]").forEach((b) => b.addEventListener("click", () => applyLang(b.dataset.lang)));

  // Шапка и нижняя панель при прокрутке
  const nav = $("#nav"), mbar = $("#mbar"), leadSec = $("#lead");
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle("is-scrolled", y > 10);
    const r = leadSec.getBoundingClientRect();
    mbar.classList.toggle("show", y > 500 && r.top > window.innerHeight * 0.6);
  };
  window.addEventListener("scroll", onScroll, { passive: true });

  // Кнопки «Заказать …» выбирают услугу в форме
  $$("[data-pick]").forEach((a) => a.addEventListener("click", () => {
    const r = $(`input[name="service"][value="${a.dataset.pick}"]`);
    if (r) r.checked = true;
  }));

  // Живая переписка с ботом в телефоне
  const chat = $("#chat");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let run = 0;
  function bubble([who, text, btns]) {
    const m = el("div", "msg msg--" + who, text);
    if (btns) {
      const b = el("div", "msg__btns");
      btns.forEach((x) => b.appendChild(el("span", "", x)));
      m.appendChild(b);
    }
    return m;
  }
  async function restartChat() {
    const id = ++run;
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    while (id === run) {
      chat.innerHTML = "";
      for (const line of t("chat")) {
        if (id !== run) return;
        if (line[0] === "bot" && !reduce) {
          const ty = el("div", "msg msg--bot typing");
          ty.innerHTML = "<i></i><i></i><i></i>";
          chat.appendChild(ty);
          await wait(900);
          ty.remove();
          if (id !== run) return;
        }
        chat.appendChild(bubble(line));
        while (chat.children.length > 6) chat.firstChild.remove();
        await wait(reduce ? 400 : 1400);
      }
      if (reduce) return;
      await wait(3500);
    }
  }

  applyLang(lang);
  onScroll();

  // Плавное появление блоков
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal:not(.in)").forEach((r, i) => {
    r.style.transitionDelay = (r.closest(".hero") ? i * 70 : 0) + "ms";
    io.observe(r);
  });

  // Форма заявки
  const form = $("#form"), note = $("#formNote");
  const phoneField = form.phone.closest(".field");
  form.phone.addEventListener("input", () => phoneField.classList.remove("is-bad"));
  const setNote = (cls, key) => { note.className = "form__note " + cls; note.removeAttribute("data-t"); note.textContent = t(key); };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    data.lang = lang;
    if ((data.phone || "").replace(/\D/g, "").length < 9) {
      phoneField.classList.add("is-bad");
      setNote("err", "form.badphone");
      form.phone.focus();
      return;
    }
    const btn = form.querySelector("button");
    btn.disabled = true;
    setNote("", "form.sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(res.status);
      form.reset();
      setNote("ok", "form.ok");
    } catch (err) {
      setNote("err", "form.fail");
      const a = el("a", "", "@" + S.telegram);
      a.href = tg; a.target = "_blank"; a.rel = "noopener"; a.style.textDecoration = "underline";
      note.append(a);
    } finally {
      btn.disabled = false;
    }
  });
})();
