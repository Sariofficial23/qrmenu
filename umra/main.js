(function () {
  const S = window.SITE || {};
  const T = window.I18N;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  let lang = "uz";
  try { const v = localStorage.getItem("umra-lang"); if (v === "ru" || v === "uz") lang = v; } catch (e) {}
  const t = (k) => String(T[lang][k] ?? T.uz[k] ?? "").replace(/\{n\}/g, S.firms);

  // Пиксель Meta (если указан в config.js)
  const track = (ev, data) => { try { window.fbq && window.fbq("track", ev, data); } catch (e) {} };
  if (/^\d{5,20}$/.test(String(S.metaPixel || ""))) {
    !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = []; t = b.createElement(e); t.async = !0;
      t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    window.fbq("init", String(S.metaPixel));
    window.fbq("track", "PageView");
  }

  // Контакты
  const tel = "tel:" + String(S.phone).replace(/[^\d+]/g, "");
  $$("[data-phone]").forEach((e) => (e.textContent = S.phone));
  $$("[data-phone-link]").forEach((e) => (e.href = tel));
  $$("[data-tg-link]").forEach((e) => { if (S.telegram) e.href = "https://t.me/" + S.telegram; else e.hidden = true; });
  $$("[data-tg-handle]").forEach((e) => (e.textContent = "@" + S.telegram));
  $$("[data-ig-link]").forEach((e) => { if (S.instagram) e.href = "https://instagram.com/" + S.instagram; else e.hidden = true; });
  $$("[data-ig-handle]").forEach((e) => (e.textContent = "@" + S.instagram));
  $("#year").textContent = new Date().getFullYear();
  document.addEventListener("click", (e) => {
    const a = e.target.closest && e.target.closest("[data-phone-link],[data-tg-link]");
    if (a) track("Contact");
  });

  function applyLang(next) {
    lang = next;
    try { localStorage.setItem("umra-lang", lang); } catch (e) {}
    document.documentElement.lang = lang;
    document.title = t("meta.title");
    $('meta[name="description"]').content = t("meta.desc");
    $$("[data-t]").forEach((e) => (e.innerHTML = t(e.dataset.t)));
    $$("[data-tp]").forEach((e) => (e.placeholder = t(e.dataset.tp)));
    $$("[data-city]").forEach((e) => (e.textContent = (S.city && S.city[lang]) || ""));
    $$("[data-lang]").forEach((b) => { b.classList.toggle("on", b.dataset.lang === lang); b.setAttribute("aria-pressed", b.dataset.lang === lang); });
  }
  $$("[data-lang]").forEach((b) => b.addEventListener("click", () => applyLang(b.dataset.lang)));
  applyLang(lang);

  // Временный переключатель вариантов дизайна A / B / C
  const setTheme = (v) => {
    document.documentElement.dataset.theme = v;
    try { localStorage.setItem("umra-theme", v); } catch (e) {}
    $$("[data-set]").forEach((b) => b.classList.toggle("on", b.dataset.set === v));
    const u = new URL(location.href); u.searchParams.set("theme", v); history.replaceState(null, "", u);
  };
  $$("[data-set]").forEach((b) => b.addEventListener("click", () => setTheme(b.dataset.set)));
  setTheme(document.documentElement.dataset.theme || "a");

  // Анимация логотипа: проигрывается один раз и останавливается на последнем кадре
  const intro = $("#intro");
  if (intro) intro.addEventListener("ended", () => { intro.pause(); });

  // Шапка и нижняя панель
  const nav = $("#nav"), mbar = $("#mbar"), leadSec = $("#lead");
  const onScroll = () => {
    nav.classList.toggle("is-scrolled", scrollY > 10);
    mbar.classList.toggle("show", scrollY > 500 && leadSec.getBoundingClientRect().top > innerHeight * 0.6);
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal").forEach((el, i) => { el.style.transitionDelay = (el.closest(".hero") ? i * 80 : 0) + "ms"; io.observe(el); });

  // «Narxini bilish» выбирает тариф в форме
  $$("[data-pick]").forEach((a) => a.addEventListener("click", () => {
    const r = $(`input[name="tariff"][value="${a.dataset.pick}"]`); if (r) r.checked = true;
  }));

  // Форма
  const form = $("#form"), note = $("#formNote"), phoneField = form.phone.closest(".field");
  form.phone.addEventListener("input", () => phoneField.classList.remove("is-bad"));
  const setNote = (cls, key) => { note.className = "form__note " + cls; note.removeAttribute("data-t"); note.textContent = t(key); };
  const TARIFF = { eco: "Эконом", std: "Стандарт", prem: "Премиум", unk: "Не знает" };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(form));
    if ((d.phone || "").replace(/\D/g, "").length < 9) { phoneField.classList.add("is-bad"); setNote("err", "f.bad"); form.phone.focus(); return; }
    const btn = form.querySelector("button"); btn.disabled = true; setNote("", "f.sending");
    try {
      const ctrl = new AbortController(); const timer = setTimeout(() => ctrl.abort(), 15000);
      const res = await fetch(S.leadApi, {
        method: "POST", headers: { "Content-Type": "application/json" }, signal: ctrl.signal,
        body: JSON.stringify({ site: "umra", name: d.name, phone: d.phone, tariff: TARIFF[d.tariff] || "—", lang, website: d.website }),
      });
      clearTimeout(timer);
      if (!res.ok) throw new Error(res.status);
      form.reset(); form.querySelector('input[value="std"]').checked = true;
      track("Lead", { content_name: d.tariff });
      setNote("ok", "f.ok");
    } catch (err) {
      setNote("err", "f.fail");
      const a = document.createElement("a"); a.href = tel; a.textContent = S.phone; note.append(a);
    } finally { btn.disabled = false; }
  });
})();
