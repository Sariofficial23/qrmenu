// Vercel Function: принимает заявку с сайта и отправляет её в Telegram.
// Нужны переменные окружения в Vercel: TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID.
const SERVICES = { bot: "Telegram-бот", site: "Сайт / лендинг", auto: "Автоматизация", other: "Другое" };

const clean = (v, max) => String(v ?? "").trim().slice(0, max);
const esc = (s) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ ok: false });

  const b = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  if (b.website) return res.status(200).json({ ok: true }); // бот-ловушка

  const phone = clean(b.phone, 25);
  if (phone.replace(/\D/g, "").length < 9) return res.status(400).json({ ok: false, error: "phone" });

  const { TELEGRAM_BOT_TOKEN: token, TELEGRAM_CHAT_ID: chatId } = process.env;
  if (!token || !chatId) return res.status(500).json({ ok: false, error: "not_configured" });

  const tgUser = clean(b.telegram, 40).replace(/^@/, "");
  const lines = [
    "🆕 <b>Новая заявка с сайта</b>",
    "",
    `📦 <b>Услуга:</b> ${SERVICES[b.service] || "—"}`,
    `👤 <b>Имя:</b> ${esc(clean(b.name, 80)) || "—"}`,
    `📞 <b>Телефон:</b> ${esc(phone)}`,
    `✈️ <b>Telegram:</b> ${tgUser ? "@" + esc(tgUser) : "—"}`,
  ];
  const msg = clean(b.message, 1000);
  if (msg) lines.push("", `💬 ${esc(msg)}`);

  const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: lines.join("\n"), parse_mode: "HTML" }),
  });
  if (!r.ok) return res.status(502).json({ ok: false, error: "telegram" });
  return res.status(200).json({ ok: true });
};
