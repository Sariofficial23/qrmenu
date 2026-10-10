/*
 * ============================================================
 *  МЕНЮ РЕСТОРАНА — единственный файл, который нужно менять.
 * ============================================================
 *
 *  Как добавить блюдо: скопируйте любой блок { ... } в списке
 *  "items", поменяйте текст и цену. Цена — просто число в сумах.
 *
 *  Поля блюда:
 *    id     — уникальное короткое имя латиницей (не повторять!)
 *    cat    — id категории из списка "categories"
 *    price  — цена в сумах (число, без пробелов)
 *    name   — название на трёх языках
 *    desc   — описание на трёх языках (можно оставить пустым "")
 *    weight — вес/объём, например "350 г" (необязательно)
 *    emoji  — картинка-эмодзи, если нет фото
 *    img    — путь к фото, например "img/plov.webp" (необязательно)
 *    tags   — метки: "hit" (хит), "spicy" (острое), "veg" (вегетарианское), "new" (новинка)
 *    hidden — true, если блюдо временно закончилось (скрыть из меню)
 */

window.MENU = {
  restaurant: {
    name: "Choyxona Demo",
    tagline: {
      ru: "Узбекская и европейская кухня",
      uz: "O‘zbek va Yevropa taomlari",
      en: "Uzbek & European cuisine",
    },
    currency: { ru: "сум", uz: "so‘m", en: "UZS" },
    // Обслуживание в процентах (0 — если нет)
    servicePercent: 10,
    // Номер / ник официанта в Telegram для кнопки «Отправить» (необязательно), без @
    telegram: "",
  },

  categories: [
    { id: "hot",     emoji: "🍲", name: { ru: "Горячие блюда", uz: "Issiq taomlar", en: "Main dishes" } },
    { id: "soups",   emoji: "🥣", name: { ru: "Супы",          uz: "Sho‘rvalar",    en: "Soups" } },
    { id: "salads",  emoji: "🥗", name: { ru: "Салаты",        uz: "Salatlar",      en: "Salads" } },
    { id: "grill",   emoji: "🔥", name: { ru: "Шашлык",        uz: "Kaboblar",      en: "Grill" } },
    { id: "bakery",  emoji: "🫓", name: { ru: "Выпечка",       uz: "Pishiriqlar",   en: "Bakery" } },
    { id: "desserts",emoji: "🍰", name: { ru: "Десерты",       uz: "Shirinliklar",  en: "Desserts" } },
    { id: "drinks",  emoji: "🍹", name: { ru: "Напитки",       uz: "Ichimliklar",   en: "Drinks" } },
  ],

  items: [
    // ---------- Горячие блюда ----------
    { id: "plov", cat: "hot", price: 45000, weight: "400 г", emoji: "🍛", tags: ["hit"],
      name: { ru: "Плов ташкентский", uz: "Toshkent oshi", en: "Tashkent plov" },
      desc: { ru: "Рис девзира, баранина, жёлтая морковь, нут, перепелиное яйцо",
              uz: "Devzira guruch, qo‘y go‘shti, sariq sabzi, no‘xat, bedana tuxumi",
              en: "Devzira rice, lamb, yellow carrot, chickpeas, quail egg" } },
    { id: "lagman", cat: "hot", price: 38000, weight: "450 г", emoji: "🍜", tags: ["hit"],
      name: { ru: "Лагман", uz: "Lag‘mon", en: "Lagman" },
      desc: { ru: "Тянутая лапша ручной работы с говядиной и овощами",
              uz: "Qo‘lda cho‘zilgan lag‘mon, mol go‘shti va sabzavotlar bilan",
              en: "Hand-pulled noodles with beef and vegetables" } },
    { id: "manti", cat: "hot", price: 36000, weight: "5 шт", emoji: "🥟",
      name: { ru: "Манты", uz: "Manti", en: "Manti dumplings" },
      desc: { ru: "С рубленой бараниной и луком, подаются со сметаной",
              uz: "Qo‘y go‘shti va piyoz bilan, qaymoq bilan tortiladi",
              en: "Steamed with minced lamb and onion, served with sour cream" } },
    { id: "kazan-kabob", cat: "hot", price: 65000, weight: "450 г", emoji: "🍖", tags: ["new"],
      name: { ru: "Казан-кабоб", uz: "Qozon kabob", en: "Kazan kebab" },
      desc: { ru: "Томлёная баранина с картофелем фри в казане",
              uz: "Qozonda dimlangan qo‘y go‘shti va kartoshka",
              en: "Lamb braised in a cauldron with crispy potatoes" } },
    { id: "dimlama", cat: "hot", price: 42000, weight: "450 г", emoji: "🥘",
      name: { ru: "Димлама", uz: "Dimlama", en: "Dimlama" },
      desc: { ru: "Тушёные овощи с говядиной в собственном соку",
              uz: "Mol go‘shti bilan o‘z sharbatida dimlangan sabzavotlar",
              en: "Beef and vegetables slowly stewed in their own juices" } },

    // ---------- Супы ----------
    { id: "shurpa", cat: "soups", price: 32000, weight: "400 мл", emoji: "🍲", tags: ["hit"],
      name: { ru: "Шурпа", uz: "Sho‘rva", en: "Shurpa" },
      desc: { ru: "Наваристый суп из баранины с овощами",
              uz: "Qo‘y go‘shtidan sabzavotli quyuq sho‘rva",
              en: "Rich lamb broth with vegetables" } },
    { id: "mastava", cat: "soups", price: 28000, weight: "400 мл", emoji: "🥣",
      name: { ru: "Мастава", uz: "Mastava", en: "Mastava" },
      desc: { ru: "Рисовый суп с говядиной и катыком",
              uz: "Mol go‘shti va qatiq bilan guruchli sho‘rva",
              en: "Rice soup with beef and yogurt" } },
    { id: "chuchvara", cat: "soups", price: 30000, weight: "400 мл", emoji: "🥟",
      name: { ru: "Чучвара в бульоне", uz: "Chuchvara", en: "Chuchvara soup" },
      desc: { ru: "Маленькие пельмени в прозрачном бульоне с зеленью",
              uz: "Shaffof sho‘rvada kichik chuchvaralar",
              en: "Tiny dumplings in clear broth with herbs" } },

    // ---------- Салаты ----------
    { id: "achichuk", cat: "salads", price: 18000, weight: "250 г", emoji: "🍅", tags: ["veg"],
      name: { ru: "Ачичук", uz: "Achchiq-chuchuk", en: "Achichuk" },
      desc: { ru: "Томаты, лук, острый перец, базилик",
              uz: "Pomidor, piyoz, achchiq qalampir, rayhon",
              en: "Tomato, onion, chili pepper, basil" } },
    { id: "caesar", cat: "salads", price: 42000, weight: "280 г", emoji: "🥗",
      name: { ru: "Цезарь с курицей", uz: "Tovuqli Sezar", en: "Chicken Caesar" },
      desc: { ru: "Романо, курица гриль, пармезан, гренки, соус цезарь",
              uz: "Romano, grilda tovuq, parmezan, suxariklar, Sezar sousi",
              en: "Romaine, grilled chicken, parmesan, croutons, Caesar dressing" } },
    { id: "tashkent-salad", cat: "salads", price: 35000, weight: "250 г", emoji: "🥙",
      name: { ru: "Салат «Ташкент»", uz: "«Toshkent» salati", en: "Tashkent salad" },
      desc: { ru: "Говядина, редька, жареный лук, перепелиные яйца",
              uz: "Mol go‘shti, turp, qovurilgan piyoz, bedana tuxumi",
              en: "Beef, radish, fried onion, quail eggs" } },
    { id: "greek", cat: "salads", price: 34000, weight: "260 г", emoji: "🫒", tags: ["veg"],
      name: { ru: "Греческий", uz: "Grek salati", en: "Greek salad" },
      desc: { ru: "Свежие овощи, фета, оливки, оливковое масло",
              uz: "Yangi sabzavotlar, feta, zaytun, zaytun moyi",
              en: "Fresh vegetables, feta, olives, olive oil" } },

    // ---------- Шашлык ----------
    { id: "lamb-kebab", cat: "grill", price: 28000, weight: "1 шп", emoji: "🍢", tags: ["hit"],
      name: { ru: "Шашлык из баранины", uz: "Qo‘y go‘shti kabob", en: "Lamb skewer" },
      desc: { ru: "Мякоть баранины на углях", uz: "Ko‘mirda pishirilgan qo‘y go‘shti", en: "Lamb on charcoal" } },
    { id: "lulya", cat: "grill", price: 24000, weight: "1 шп", emoji: "🌭", tags: ["spicy"],
      name: { ru: "Люля-кебаб", uz: "Lyulya kabob", en: "Lula kebab" },
      desc: { ru: "Рубленое мясо со специями и зеленью", uz: "Ziravorli qiyma kabob", en: "Spiced minced meat skewer" } },
    { id: "chicken-kebab", cat: "grill", price: 22000, weight: "1 шп", emoji: "🍗",
      name: { ru: "Шашлык из курицы", uz: "Tovuq kabob", en: "Chicken skewer" },
      desc: { ru: "Маринованное бедро курицы", uz: "Marinadlangan tovuq soni", en: "Marinated chicken thigh" } },
    { id: "jigar", cat: "grill", price: 20000, weight: "1 шп", emoji: "🔥",
      name: { ru: "Жигар", uz: "Jigar kabob", en: "Liver skewer" },
      desc: { ru: "Печень ягнёнка с курдючным жиром", uz: "Dumba bilan qo‘zi jigari", en: "Lamb liver with tail fat" } },

    // ---------- Выпечка ----------
    { id: "samsa", cat: "bakery", price: 12000, weight: "1 шт", emoji: "🥐", tags: ["hit"],
      name: { ru: "Самса из тандыра", uz: "Tandir somsa", en: "Tandoor samsa" },
      desc: { ru: "Слоёное тесто, рубленая баранина", uz: "Qatlama xamir, qo‘y go‘shti qiymasi", en: "Flaky pastry with minced lamb" } },
    { id: "non", cat: "bakery", price: 6000, weight: "1 шт", emoji: "🫓", tags: ["veg"],
      name: { ru: "Лепёшка", uz: "Non", en: "Flatbread" },
      desc: { ru: "Горячая лепёшка из тандыра", uz: "Tandirdan issiq non", en: "Hot tandoor flatbread" } },
    { id: "chebureki", cat: "bakery", price: 14000, weight: "1 шт", emoji: "🥟",
      name: { ru: "Чебурек", uz: "Cheburek", en: "Cheburek" },
      desc: { ru: "Хрустящий, с сочной мясной начинкой", uz: "Qarsildoq, sersuv go‘shtli", en: "Crispy fried pastry with juicy meat" } },

    // ---------- Десерты ----------
    { id: "chak-chak", cat: "desserts", price: 22000, weight: "150 г", emoji: "🍯",
      name: { ru: "Чак-чак", uz: "Chak-chak", en: "Chak-chak" },
      desc: { ru: "Хрустящее тесто в медовом сиропе", uz: "Asalli qarsildoq shirinlik", en: "Crispy dough in honey syrup" } },
    { id: "napoleon", cat: "desserts", price: 26000, weight: "160 г", emoji: "🍰", tags: ["hit"],
      name: { ru: "Наполеон", uz: "Napoleon", en: "Napoleon cake" },
      desc: { ru: "Домашний, с заварным кремом", uz: "Uy usulida, qaymoqli krem bilan", en: "Homemade, with custard cream" } },
    { id: "ice-cream", cat: "desserts", price: 18000, weight: "3 шарика", emoji: "🍨", tags: ["veg"],
      name: { ru: "Мороженое", uz: "Muzqaymoq", en: "Ice cream" },
      desc: { ru: "Ваниль, шоколад, фисташка", uz: "Vanil, shokolad, pista", en: "Vanilla, chocolate, pistachio" } },

    // ---------- Напитки ----------
    { id: "green-tea", cat: "drinks", price: 8000, weight: "чайник", emoji: "🍵",
      name: { ru: "Зелёный чай", uz: "Ko‘k choy", en: "Green tea" },
      desc: { ru: "Чайник на 2–3 человека", uz: "2–3 kishilik choynak", en: "Teapot for 2–3 people" } },
    { id: "black-tea", cat: "drinks", price: 8000, weight: "чайник", emoji: "🫖",
      name: { ru: "Чёрный чай с лимоном", uz: "Limonli qora choy", en: "Black tea with lemon" },
      desc: { ru: "", uz: "", en: "" } },
    { id: "lemonade", cat: "drinks", price: 25000, weight: "1 л", emoji: "🍋", tags: ["new"],
      name: { ru: "Домашний лимонад", uz: "Uy limonadi", en: "Homemade lemonade" },
      desc: { ru: "Лимон, мята, тархун или маракуйя", uz: "Limon, yalpiz, tarxun yoki marakuyya", en: "Lemon, mint, tarragon or passion fruit" } },
    { id: "ayran", cat: "drinks", price: 10000, weight: "0,5 л", emoji: "🥛",
      name: { ru: "Айран", uz: "Ayron", en: "Ayran" },
      desc: { ru: "Освежающий кисломолочный напиток", uz: "Salqin qatiqli ichimlik", en: "Refreshing yogurt drink" } },
    { id: "cola", cat: "drinks", price: 9000, weight: "0,5 л", emoji: "🥤",
      name: { ru: "Кока-кола", uz: "Coca-Cola", en: "Coca-Cola" },
      desc: { ru: "", uz: "", en: "" } },
    { id: "water", cat: "drinks", price: 5000, weight: "0,5 л", emoji: "💧",
      name: { ru: "Вода", uz: "Suv", en: "Water" },
      desc: { ru: "С газом / без газа", uz: "Gazli / gazsiz", en: "Sparkling / still" } },
  ],
};
