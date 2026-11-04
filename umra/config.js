// Контакты и настройки сайта Umra Consulting. Поменяли значение → сайт обновился.
window.SITE = {
  brand: "Umra Consulting",
  phone: "+99877 070 00 59",         // основной телефон (кнопки звонка)
  phone2: "+99877 277 00 59",        // второй телефон (показывается в блоке контактов)
  telegram: "hayotbek_umra",         // ник Telegram без @
  instagram: "",                      // ник Instagram без @ (пусто — кнопка скрыта)
  city: { uz: "Toshkent", ru: "Ташкент" },
  firms: 14,                          // сколько лицензированных турфирм
  metaPixel: "",                      // ID пикселя Meta (только цифры)
  // Куда отправляются заявки: своя функция umra/api/lead.js → бот → Telegram-группа
  leadApi: "/api/lead",
};
