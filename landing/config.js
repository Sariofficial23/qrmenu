// Все контакты, цифры и проекты — здесь. Поменяли значение → сайт обновился.
window.SITE = {
  brand: "AI Studio",                 // название компании
  instagram: "your_instagram",        // ник Instagram без @
  telegram: "your_telegram",          // ник Telegram для связи без @
  phone: "+998 90 000 00 00",         // телефон для звонков
  city: { uz: "Toshkent", ru: "Ташкент" },

  // Цифры на сайте (пока примерные — замените на свои)
  stats: [
    { n: "50+",  uz: "bajarilgan loyiha",           ru: "выполненных проектов" },
    { n: "30+",  uz: "mamnun mijoz",                ru: "довольных клиентов" },
    { n: "3+",   uz: "yillik tajriba",              ru: "года опыта" },
    { n: "24/7", uz: "botlar buyurtma qabul qiladi", ru: "боты принимают заказы" },
  ],

  // Наши работы. type: "bot" или "site".
  // url — ссылка на проект (бот https://t.me/имя_бота или сайт), img — скриншот из папки assets/ (необязательно)
  projects: [
    { type: "site", url: "https://restoranpos.netlify.app/", img: "",
      title: { uz: "Restoran POS", ru: "Restoran POS" },
      desc:  { uz: "Restoranlar uchun kassa tizimi lendingi.", ru: "Лендинг кассовой системы для ресторанов." } },
    { type: "site", url: "https://ihlostravel.netlify.app/", img: "",
      title: { uz: "Ihlos Travel", ru: "Ihlos Travel" },
      desc:  { uz: "Turistik kompaniya uchun lending sahifa.", ru: "Лендинг для туристической компании." } },
    { type: "bot", url: "https://t.me/dubaikafebot", img: "",
      title: { uz: "Dubai Kafe", ru: "Dubai Kafe" },
      desc:  { uz: "Mini App menyu, savat va admin-panel.", ru: "Mini App-меню, корзина и админ-панель." } },
    { type: "bot", url: "https://t.me/poytaxtdostavkabot", img: "",
      title: { uz: "Poytaxt Dostavka", ru: "Poytaxt Dostavka" },
      desc:  { uz: "Yetkazib berish: buyurtma, manzil, admin-panel.", ru: "Доставка: заказ, адрес, админ-панель." } },
    { type: "bot", url: "https://t.me/eliffastfooddostavkabot", img: "",
      title: { uz: "Elif Fast Food", ru: "Elif Fast Food" },
      desc:  { uz: "Fast-fud yetkazib berish: menyu, savat, buyurtma.", ru: "Доставка фастфуда: меню, корзина, заказ." } },
  ],
};
