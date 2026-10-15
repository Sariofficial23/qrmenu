// Vercel Function: принимает заявку с сайта и отправляет её в Telegram.
// Нужна переменная окружения в Vercel: TELEGRAM_BOT_TOKEN (бот должен быть добавлен в группу заявок).
// TELEGRAM_CHAT_ID можно переопределить, по умолчанию — группа заявок.
const DEFAULT_CHAT_ID = "-5534456848";
const SERVICES = { bot: "Telegram-бот", site: "Сайт / лендинг", auto: "Автоматизация", other: "Другое" };

const clean = (v, max) => String(v ?? "").trim().slice(0, max);
const esc = (s) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

// Сайты, которые тоже шлют заявки через эту функцию (поле site в заявке)
const SITES = { umra: "🕋 Umra Consulting" };

module.exports = async (req, res) => {
  // Разрешаем отправку с других наших сайтов (например, Umra Consulting)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ ok: false });

  const b = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  if (b.website) return res.status(200).json({ ok: true }); // бот-ловушка

  const phone = clean(b.phone, 25);
  if (phone.replace(/\D/g, "").length < 9) return res.status(400).json({ ok: false, error: "phone" });

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID || DEFAULT_CHAT_ID;
  if (!token || !chatId) return res.status(500).json({ ok: false, error: "not_configured" });

  const site = SITES[b.site];
  const lines = [
    site ? `🆕 <b>Новая заявка — ${site}</b>` : "🆕 <b>Новая заявка с сайта</b>",
    "",
    site ? `🕋 <b>Тариф:</b> ${esc(clean(b.tariff, 40)) || "—"}` : `📦 <b>Услуга:</b> ${SERVICES[b.service] || "—"}`,
    `👤 <b>Имя:</b> ${esc(clean(b.name, 80)) || "—"}`,
    `📞 <b>Телефон:</b> ${esc(phone)}`,
    `🌐 <b>Til / Язык:</b> ${b.lang === "ru" ? "RU" : "UZ"}`,
  ];

  let r;
  try {
    r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    signal: AbortSignal.timeout(10000),
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: lines.join("\n"), parse_mode: "HTML" }),
    });
  } catch (e) {
    console.error("telegram fetch failed", e.message);
    return res.status(504).json({ ok: false, error: "timeout" });
  }
  if (!r.ok) {
    console.error("telegram", r.status, await r.text());
    return res.status(502).json({ ok: false, error: "telegram" });
  }
  return res.status(200).json({ ok: true });
};
