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
      const name = p.title[lang] || p.title.uz;
      const cover = el("div", "work__cover work__cover--" + set[n % set.length]);
      if (p.type === "site" && (p.img || p.url)) cover.appendChild(siteShot(p, name));
      else if (p.type === "bot") cover.appendChild(botChat(p, name));
      else cover.innerHTML = `<svg><use href="#${ICON[p.type] || "i-spark"}"/></svg>`;
      w.append(cover, el("span", "tag", t("work.tag." + p.type)), el("h4", "", p.title[lang] || p.title.uz), el("p", "", p.desc[lang] || p.desc.uz));
      if (p.url) {
        const l = el("span", "work__link", t("work.open") + " ");
        l.insertAdjacentHTML("beforeend", '<svg><use href="#i-arrow"/></svg>');
        w.appendChild(l);
      }
      box.appendChild(w);
    });
  }

  // Обложка сайта: окно браузера со скриншотом страницы
  function siteShot(p, name) {
    const win = el("div", "bw");
    const bar = el("div", "bw__bar");
    bar.append(el("i"), el("i"), el("i"), el("span", "bw__url", (p.url || "").replace(/^https?:\/\//, "").replace(/\/$/, "")));
    const view = el("div", "bw__view");
    const pv = p.preview && window.PREVIEWS && window.PREVIEWS[p.preview];
    if (pv && !p.img) {
      view.classList.add("ok", "bw__view--pv");
      const stage = el("div", "pv-stage");
      stage.innerHTML = pv;
      view.appendChild(stage);
      // холст 640px шириной ужимаем до ширины окна карточки
      const fit = () => { const w = view.clientWidth; if (w) stage.style.transform = "scale(" + w / 640 + ")"; };
      if (window.ResizeObserver) new ResizeObserver(fit).observe(view);
      requestAnimationFrame(fit);
      win.append(bar, view);
      return win;
    }
    const im = el("img");
    im.alt = name; im.loading = "lazy"; im.decoding = "async";
    let tries = 0;
    const src = () => p.img || "https://s0.wp.com/mshots/v1/" + encodeURIComponent(p.url) + "?w=1200&h=1500" + (tries ? "&r=" + tries : "");
    // Сервис скриншотов сначала отдаёт заглушку 400×300 — ждём и пробуем ещё раз
    im.onload = () => {
      if (!p.img && im.naturalWidth === 400 && im.naturalHeight === 300 && tries < 5) {
        tries++; setTimeout(() => (im.src = src()), 3000);
      } else view.classList.add("ok");
    };
    im.onerror = () => { view.classList.add("fail"); view.insertAdjacentHTML("beforeend", '<svg><use href="#i-web"/></svg>'); };
    im.src = src();
    view.appendChild(im);
    win.append(bar, view);
    return win;
  }

  // Обложка бота: мини-чат Telegram с аватаркой бота
  function botChat(p, name) {
    const user = (p.url || "").split("t.me/")[1] || "";
    const box = el("div", "tgc");
    const head = el("div", "tgc__head");
    const ava = el("span", "tgc__ava", name.trim()[0] || "B");
    if (user) {
      const im = el("img"); im.alt = ""; im.loading = "lazy";
      im.src = "https://t.me/i/userpic/320/" + user.replace(/\/.*/, "") + ".jpg";
      im.onload = () => { if (im.naturalWidth > 1) ava.classList.add("has-img"); };
      ava.appendChild(im);
    }
    const who = el("div");
    who.append(el("b", "", name), el("small", "", user ? "@" + user : "bot"));
    head.append(ava, who);
    const body = el("div", "tgc__body");
    const m1 = el("div", "tgc__m", t("work.bot.hi"));
    const btns = el("div", "tgc__btns");
    btns.append(el("span", "", t("work.bot.b1")), el("span", "", t("work.bot.b2")));
    m1.appendChild(btns);
    body.append(m1, el("div", "tgc__m tgc__m--me", t("work.bot.me")), el("div", "tgc__m", t("work.bot.ok")));
    box.append(head, body);
    return box;
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
