// Vercel-функция: приём заявок с сайта Umra Consulting и отправка в Telegram-группу.
// Нужны переменные окружения в проекте Vercel (Settings → Environment Variables):
//   TELEGRAM_BOT_TOKEN — токен бота от @BotFather
//   TELEGRAM_CHAT_ID   — id вашей Telegram-группы заявок (например -1001234567890)
const clean = (v, max) => String(v ?? "").trim().slice(0, max);
const esc = (s) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ ok: false });

  const b = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  if (b.website) return res.status(200).json({ ok: true }); // honeypot (ловушка для спам-ботов)

  const phone = clean(b.phone, 25);
  if (phone.replace(/\D/g, "").length < 9) return res.status(400).json({ ok: false, error: "phone" });

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return res.status(500).json({ ok: false, error: "not_configured" });

  const lines = [
    "🆕 <b>Новая заявка — 🕋 Umra Consulting</b>",
    "",
    `🧳 <b>Тариф:</b> ${esc(clean(b.tariff, 40)) || "—"}`,
    `👤 <b>Имя:</b> ${esc(clean(b.name, 80)) || "—"}`,
    `📞 <b>Телефон:</b> ${esc(phone)}`,
    `🌐 <b>Til / Язык:</b> ${b.lang === "ru" ? "RU" : "UZ"}`,
  ];

  const send = (chat) => fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    signal: AbortSignal.timeout(10000),
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chat, text: lines.join("\n"), parse_mode: "HTML" }),
  });

  try {
    let r = await send(chatId);
    let data = await r.json().catch(() => ({}));
    // Группа стала супергруппой → у неё новый id. Отправляем туда и пишем в лог, чтобы обновить TELEGRAM_CHAT_ID.
    const moved = data && data.parameters && data.parameters.migrate_to_chat_id;
    if (!r.ok && moved) {
      console.warn("telegram: group migrated, set TELEGRAM_CHAT_ID to", moved);
      r = await send(moved);
      data = await r.json().catch(() => ({}));
    }
    if (!r.ok) {
      console.error("telegram", r.status, data && data.description);
      return res.status(502).json({ ok: false, error: "telegram" });
    }
    console.log("lead sent to telegram");
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("telegram fetch failed", e.message);
    return res.status(504).json({ ok: false, error: "timeout" });
  }
};
