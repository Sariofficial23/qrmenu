(function () {
  const S = window.SITE || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

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
  $$("[data-city]").forEach((e) => (e.textContent = S.city));
  $("#year").textContent = new Date().getFullYear();
  if (S.brand) document.title = document.title.replace("AI Studio", S.brand);

  // Шапка и нижняя панель при прокрутке
  const nav = $("#nav"), mbar = $("#mbar"), leadSec = $("#lead");
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle("is-scrolled", y > 10);
    const r = leadSec.getBoundingClientRect();
    mbar.classList.toggle("show", y > 500 && r.top > window.innerHeight * 0.6);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Плавное появление блоков
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal").forEach((el, i) => {
    el.style.transitionDelay = (el.closest(".hero") ? i * 70 : 0) + "ms";
    io.observe(el);
  });

  // Кнопки «Заказать …» выбирают услугу в форме
  $$("[data-pick]").forEach((a) => a.addEventListener("click", () => {
    const r = $(`input[name="service"][value="${a.dataset.pick}"]`);
    if (r) r.checked = true;
  }));

  // Живая переписка с ботом в телефоне
  const chat = $("#chat");
  const script = [
    ["bot", "Здравствуйте! 👋 Я бот доставки. Что закажем сегодня?", ["🍽 Меню", "🛒 Корзина"]],
    ["me", "Плов и лагман на двоих"],
    ["bot", "Отлично! Плов ×2, Лагман ×2 — 145 000 сум. Куда доставить?"],
    ["me", "Чиланзар, 9 квартал"],
    ["bot", "Заказ #248 принят ✅ Курьер будет через 35 минут."],
  ];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function bubble([who, text, btns]) {
    const m = document.createElement("div");
    m.className = "msg msg--" + who;
    m.textContent = text;
    if (btns) {
      const b = document.createElement("div");
      b.className = "msg__btns";
      btns.forEach((t) => { const s = document.createElement("span"); s.textContent = t; b.appendChild(s); });
      m.appendChild(b);
    }
    return m;
  }
  async function play() {
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    for (;;) {
      chat.innerHTML = "";
      for (const line of script) {
        if (line[0] === "bot" && !reduce) {
          const t = document.createElement("div");
          t.className = "msg msg--bot typing";
          t.innerHTML = "<i></i><i></i><i></i>";
          chat.appendChild(t);
          await wait(900);
          t.remove();
        }
        chat.appendChild(bubble(line));
        while (chat.children.length > 6) chat.firstChild.remove();
        await wait(reduce ? 400 : 1400);
      }
      if (reduce) return;
      await wait(3500);
    }
  }
  play();

  // Форма заявки
  const form = $("#form"), note = $("#formNote");
  const phoneField = form.phone.closest(".field");
  form.phone.addEventListener("input", () => phoneField.classList.remove("is-bad"));

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const digits = (data.phone || "").replace(/\D/g, "");
    if (digits.length < 9) {
      phoneField.classList.add("is-bad");
      note.className = "form__note err";
      note.textContent = "Укажите номер телефона, чтобы мы могли связаться.";
      form.phone.focus();
      return;
    }
    const btn = form.querySelector("button");
    btn.disabled = true;
    note.className = "form__note";
    note.textContent = "Отправляем…";
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(res.status);
      form.reset();
      note.className = "form__note ok";
      note.textContent = "Спасибо! Заявка отправлена — скоро свяжемся с вами.";
    } catch (err) {
      note.className = "form__note err";
      note.innerHTML = "";
      note.append("Не удалось отправить. Напишите нам в Telegram: ");
      const a = document.createElement("a");
      a.href = tg; a.target = "_blank"; a.rel = "noopener"; a.textContent = "@" + S.telegram;
      a.style.textDecoration = "underline";
      note.append(a);
    } finally {
      btn.disabled = false;
    }
  });
})();
