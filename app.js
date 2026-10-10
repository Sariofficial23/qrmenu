(function () {
  "use strict";

  var M = window.MENU;
  var R = M.restaurant;
  var LANGS = ["ru", "uz", "en"];

  var T = {
    ru: {
      search: "Найти блюдо…", nothing: "Ничего не найдено", cart: "Мой заказ", items: "Мой заказ",
      add: "+ Добавить", note: "Пожелания к заказу", notePh: "Например: без лука, острее, сначала салаты",
      subtotal: "Блюда", service: "Обслуживание", total: "Итого",
      showWaiter: "Показать официанту", clear: "Очистить корзину",
      waiter: "Заказ", table: "Стол", noTable: "Без стола",
      share: "Отправить заказ", done: "Заказ принят — очистить",
      askTable: "Номер вашего стола?", save: "Готово",
      added: "Добавлено", copied: "Заказ скопирован", cleared: "Корзина очищена",
      confirmClear: "Очистить корзину?", tags: { hit: "Хит", spicy: "Острое", veg: "Вег", new: "Новинка" },
    },
    uz: {
      search: "Taom qidirish…", nothing: "Hech narsa topilmadi", cart: "Buyurtmam", items: "Buyurtmam",
      add: "+ Qo‘shish", note: "Buyurtma uchun izoh", notePh: "Masalan: piyozsiz, achchiqroq, avval salatlar",
      subtotal: "Taomlar", service: "Xizmat", total: "Jami",
      showWaiter: "Ofitsiantga ko‘rsatish", clear: "Savatni tozalash",
      waiter: "Buyurtma", table: "Stol", noTable: "Stolsiz",
      share: "Buyurtmani yuborish", done: "Qabul qilindi — tozalash",
      askTable: "Stolingiz raqami?", save: "Tayyor",
      added: "Qo‘shildi", copied: "Buyurtma nusxalandi", cleared: "Savat tozalandi",
      confirmClear: "Savatni tozalaysizmi?", tags: { hit: "Xit", spicy: "Achchiq", veg: "Veg", new: "Yangi" },
    },
    en: {
      search: "Search dishes…", nothing: "Nothing found", cart: "My order", items: "My order",
      add: "+ Add", note: "Order notes", notePh: "E.g. no onion, extra spicy, salads first",
      subtotal: "Dishes", service: "Service", total: "Total",
      showWaiter: "Show to waiter", clear: "Clear cart",
      waiter: "Order", table: "Table", noTable: "No table",
      share: "Send order", done: "Order taken — clear",
      askTable: "Your table number?", save: "Done",
      added: "Added", copied: "Order copied", cleared: "Cart cleared",
      confirmClear: "Clear the cart?", tags: { hit: "Hit", spicy: "Spicy", veg: "Veg", new: "New" },
    },
  };

  // ---------- Хранилище (безопасно, если localStorage недоступен) ----------
  function load(key, fallback) {
    try { var v = localStorage.getItem("qrmenu:" + key); return v == null ? fallback : JSON.parse(v); }
    catch (e) { return fallback; }
  }
  function save(key, value) {
    try { localStorage.setItem("qrmenu:" + key, JSON.stringify(value)); } catch (e) { /* ignore */ }
  }

  // ---------- Состояние ----------
  var params = new URLSearchParams(location.search);
  var urlTable = params.get("table") || params.get("t");
  var urlLang = params.get("lang");
  var navLang = (navigator.language || "ru").slice(0, 2);

  var state = {
    lang: LANGS.indexOf(urlLang) >= 0 ? urlLang : load("lang", LANGS.indexOf(navLang) >= 0 ? navLang : "ru"),
    table: urlTable ? String(urlTable).replace(/[^\w-]/g, "").slice(0, 6) : load("table", ""),
    cart: load("cart", {}),
    note: load("note", ""),
  };
  if (urlTable) save("table", state.table);
  if (urlLang && LANGS.indexOf(urlLang) >= 0) save("lang", urlLang);

  // Старая корзина (больше 6 часов) — это прошлый визит, начинаем заново
  if (Date.now() - load("savedAt", 0) > 6 * 3600 * 1000) { state.cart = {}; state.note = ""; }

  var byId = {};
  M.items.forEach(function (it) { if (!it.hidden) byId[it.id] = it; });
  // Убираем из корзины блюда, которых больше нет в меню
  Object.keys(state.cart).forEach(function (id) { if (!byId[id] || !(state.cart[id] > 0)) delete state.cart[id]; });

  // ---------- Утилиты ----------
  var $ = function (id) { return document.getElementById(id); };
  function t(key) { return T[state.lang][key]; }
  function tr(obj) { return obj ? (obj[state.lang] || obj.ru || "") : ""; }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function money(n) {
    return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " " + tr(R.currency);
  }
  function totals() {
    var count = 0, sub = 0;
    Object.keys(state.cart).forEach(function (id) {
      count += state.cart[id];
      sub += state.cart[id] * byId[id].price;
    });
    var service = Math.round(sub * (R.servicePercent || 0) / 100);
    return { count: count, sub: sub, service: service, total: sub + service };
  }
  function persist() { save("cart", state.cart); save("note", state.note); save("savedAt", Date.now()); }

  var toastTimer;
  function toast(msg) {
    var el = $("toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove("show"); }, 1600);
  }
  function vibrate() { if (navigator.vibrate) try { navigator.vibrate(10); } catch (e) { /* ignore */ } }

  // ---------- Рендер меню ----------
  function controlsHtml(id) {
    var q = state.cart[id] || 0;
    if (!q) return '<button class="add" data-add="' + id + '">' + esc(t("add")) + "</button>";
    return '<div class="stepper"><button data-dec="' + id + '" aria-label="−">−</button><span>' + q +
      '</span><button data-inc="' + id + '" aria-label="+">+</button></div>';
  }

  function renderMenu() {
    var html = "";
    var navHtml = "";
    M.categories.forEach(function (c) {
      var items = M.items.filter(function (it) { return it.cat === c.id && !it.hidden; });
      if (!items.length) return;
      navHtml += '<button data-cat="' + c.id + '">' + (c.emoji ? c.emoji + " " : "") + esc(tr(c.name)) + "</button>";
      html += '<section class="section" id="cat-' + c.id + '" data-section="' + c.id + '">' +
        '<h2 class="section__title">' + esc(tr(c.name)) + " <small>" + items.length + "</small></h2><div class=\"grid\">";
      items.forEach(function (it) {
        var tags = (it.tags || []).map(function (tg) {
          return '<span class="tag tag--' + tg + '">' + esc(t("tags")[tg] || tg) + "</span>";
        }).join("");
        var search = [it.name.ru, it.name.uz, it.name.en, tr(it.desc)].join(" ").toLowerCase();
        html += '<article class="dish" data-id="' + it.id + '" data-search="' + esc(search) + '">' +
          '<div class="dish__pic">' + esc(it.emoji || "🍽️") +
          (it.img ? '<img src="' + esc(it.img) + '" alt="" loading="lazy" decoding="async" onerror="this.remove()">' : "") +
          "</div>" +
          '<div class="dish__body"><h3 class="dish__name">' + esc(tr(it.name)) + "</h3>" +
          (tr(it.desc) ? '<p class="dish__desc">' + esc(tr(it.desc)) + "</p>" : "") +
          (tags ? '<div class="tags">' + tags + "</div>" : "") +
          '<div class="dish__foot"><div class="price">' + money(it.price) +
          (it.weight ? "<small>" + esc(it.weight) + "</small>" : "") + "</div>" +
          '<div class="ctl" data-ctl="' + it.id + '">' + controlsHtml(it.id) + "</div></div></div></article>";
      });
      html += "</div></section>";
    });
    $("menu").innerHTML = html;
    $("cats").innerHTML = navHtml;
    observeSections();
  }

  function renderTexts() {
    document.documentElement.lang = state.lang;
    document.title = R.name + " — " + tr({ ru: "Меню", uz: "Menyu", en: "Menu" });
    $("restName").textContent = R.name;
    $("restTagline").textContent = tr(R.tagline);
    $("search").placeholder = t("search");
    $("emptySearch").textContent = t("nothing");
    $("cartTitle").textContent = t("cart");
    $("fabLabel").textContent = t("items");
    $("noteLabel").textContent = t("note");
    $("orderNote").placeholder = t("notePh");
    $("showWaiter").textContent = t("showWaiter");
    $("clearCart").textContent = t("clear");
    $("shareOrder").textContent = t("share");
    $("doneOrder").textContent = t("done");
    $("tableAsk").textContent = t("askTable");
    $("tableSave").textContent = t("save");
    var tb = $("tableBadge");
    tb.hidden = !state.table;
    tb.textContent = t("table") + " " + state.table;
    Array.prototype.forEach.call($("langs").children, function (b) {
      b.classList.toggle("active", b.getAttribute("data-lang") === state.lang);
    });
  }

  // ---------- Корзина ----------
  function updateDish(id) {
    var ctl = document.querySelector('[data-ctl="' + id + '"]');
    if (ctl) ctl.innerHTML = controlsHtml(id);
  }

  function updateFab(bump) {
    var s = totals();
    var fab = $("cartFab");
    fab.hidden = s.count === 0;
    $("fabCount").textContent = s.count;
    $("fabSum").textContent = money(s.total);
    if (bump && !fab.hidden) {
      fab.classList.remove("bump");
      void fab.offsetWidth;
      fab.classList.add("bump");
    }
  }

  function setQty(id, q) {
    if (!byId[id]) return;
    if (q > 0) state.cart[id] = Math.min(q, 99); else delete state.cart[id];
    persist();
    updateDish(id);
    updateFab(true);
    if ($("cartSheet").classList.contains("open")) renderCart();
    vibrate();
  }

  function cartIds() {
    // Порядок как в меню
    return M.items.filter(function (it) { return state.cart[it.id]; }).map(function (it) { return it.id; });
  }

  function totalsHtml(s) {
    var rows = "";
    if (s.service) {
      rows += "<div><span>" + esc(t("subtotal")) + "</span><span>" + money(s.sub) + "</span></div>";
      rows += "<div><span>" + esc(t("service")) + " " + R.servicePercent + "%</span><span>" + money(s.service) + "</span></div>";
    }
    return rows + '<div class="grand"><span>' + esc(t("total")) + "</span><span>" + money(s.total) + "</span></div>";
  }

  function renderCart() {
    var ids = cartIds();
    if (!ids.length) { closeSheet("cartSheet"); return; }
    $("cartList").innerHTML = ids.map(function (id) {
      var it = byId[id];
      return '<div class="cart-row"><div class="cart-row__emoji">' + esc(it.emoji || "🍽️") + "</div>" +
        '<div class="cart-row__info"><div class="cart-row__name">' + esc(tr(it.name)) + "</div>" +
        '<div class="cart-row__price">' + money(it.price * state.cart[id]) + "</div></div>" +
        '<div class="ctl" data-ctl="' + id + '">' + controlsHtml(id) + "</div></div>";
    }).join("");
    $("cartTotals").innerHTML = totalsHtml(totals());
  }

  // ---------- Шторки и экраны ----------
  var openStack = [];
  function openLayer(id) {
    var el = $(id);
    el.classList.add("open");
    el.setAttribute("aria-hidden", "false");
    document.body.classList.add("locked");
    openStack.push(id);
    // Кнопка «назад» на Android закрывает окно, а не уходит с сайта
    try { history.pushState({ layer: id }, ""); } catch (e) { /* ignore */ }
  }
  function hideLayer(id) {
    var el = $(id);
    el.classList.remove("open");
    el.setAttribute("aria-hidden", "true");
    openStack = openStack.filter(function (x) { return x !== id; });
    if (!openStack.length) document.body.classList.remove("locked");
  }
  function closeSheet(id) {
    if (openStack.indexOf(id) < 0) return;
    if (openStack[openStack.length - 1] === id && history.state && history.state.layer === id) history.back();
    else hideLayer(id);
  }
  window.addEventListener("popstate", function () {
    var top = openStack[openStack.length - 1];
    if (top) hideLayer(top);
  });

  function openCart() {
    renderCart();
    $("orderNote").value = state.note;
    openLayer("cartSheet");
  }

  function orderText() {
    var lines = [R.name + " — " + t("waiter")];
    lines.push(state.table ? t("table") + " " + state.table : t("noTable"));
    lines.push("");
    cartIds().forEach(function (id) {
      var it = byId[id];
      lines.push(state.cart[id] + " × " + tr(it.name) + " — " + money(it.price * state.cart[id]));
    });
    if (state.note) { lines.push(""); lines.push("💬 " + state.note); }
    lines.push("");
    lines.push(t("total") + ": " + money(totals().total));
    return lines.join("\n").replace(/ /g, " ");
  }

  function renderWaiter() {
    $("waiterTitle").textContent = t("waiter");
    $("waiterTable").textContent = state.table ? t("table") + " " + state.table : t("noTable");
    var d = new Date();
    $("waiterTime").textContent = d.toLocaleTimeString(state.lang === "en" ? "en-GB" : "ru-RU", { hour: "2-digit", minute: "2-digit" });
    $("waiterList").innerHTML = cartIds().map(function (id) {
      var it = byId[id];
      // Официанту показываем русское название (+ язык гостя, если отличается)
      var main = it.name.ru;
      var sub = state.lang !== "ru" && tr(it.name) !== main ? "<small>" + esc(tr(it.name)) + "</small>" : "";
      return '<li><span class="q">' + state.cart[id] + '×</span><span class="n">' + esc(main) + sub +
        '</span><span class="s">' + money(it.price * state.cart[id]) + "</span></li>";
    }).join("");
    var note = $("waiterNote");
    note.hidden = !state.note;
    note.textContent = "💬 " + state.note;
    $("waiterTotal").innerHTML = totalsHtml(totals());
  }

  function showWaiter() {
    if (!state.table) { openTableAsk(); return; }
    renderWaiter();
    openLayer("waiter");
  }

  function openTableAsk() {
    $("tableInput").value = state.table || "";
    openLayer("tableSheet");
    setTimeout(function () { $("tableInput").focus(); }, 300);
  }

  function saveTable() {
    var v = $("tableInput").value.trim().replace(/[^\w-]/g, "").slice(0, 6);
    state.table = v;
    save("table", v);
    renderTexts();
    closeSheet("tableSheet");
    if (totals().count) setTimeout(function () { renderWaiter(); openLayer("waiter"); }, 350);
  }

  function shareOrder() {
    var text = orderText();
    if (R.telegram) {
      location.href = "https://t.me/" + encodeURIComponent(R.telegram) + "?text=" + encodeURIComponent(text);
      return;
    }
    if (navigator.share) {
      navigator.share({ text: text }).catch(function () { /* отменено */ });
      return;
    }
    copy(text);
  }

  function copy(text) {
    var done = function () { toast(t("copied")); };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, function () { legacyCopy(text); done(); });
    } else { legacyCopy(text); done(); }
  }
  function legacyCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); } catch (e) { /* ignore */ }
    ta.remove();
  }

  function clearCart() {
    state.cart = {};
    state.note = "";
    persist();
    Object.keys(byId).forEach(updateDish);
    updateFab(false);
    toast(t("cleared"));
  }

  // ---------- Категории: подсветка при прокрутке ----------
  var observer;
  function setActiveCat(id) {
    var nav = $("cats");
    Array.prototype.forEach.call(nav.children, function (b) {
      var on = b.getAttribute("data-cat") === id;
      if (on && !b.classList.contains("active")) {
        b.classList.add("active");
        nav.scrollTo({ left: b.offsetLeft - 16, behavior: "smooth" });
      } else if (!on) b.classList.remove("active");
    });
  }
  function observeSections() {
    if (observer) observer.disconnect();
    if (!("IntersectionObserver" in window)) return;
    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) setActiveCat(e.target.getAttribute("data-section"));
      });
    }, { rootMargin: "-70px 0px -65% 0px" });
    document.querySelectorAll("[data-section]").forEach(function (s) { observer.observe(s); });
  }

  // ---------- Поиск ----------
  function applySearch() {
    var q = $("search").value.trim().toLowerCase();
    var any = false;
    document.querySelectorAll("[data-section]").forEach(function (sec) {
      var visible = 0;
      sec.querySelectorAll(".dish").forEach(function (d) {
        var show = !q || d.getAttribute("data-search").indexOf(q) >= 0;
        d.hidden = !show;
        if (show) visible++;
      });
      sec.hidden = visible === 0;
      if (visible) any = true;
    });
    $("emptySearch").hidden = any;
    $("cats").hidden = !!q;
  }

  // ---------- События ----------
  document.addEventListener("click", function (e) {
    var b = e.target.closest("button, [data-close]");
    if (!b) return;
    var id;
    if ((id = b.getAttribute("data-add"))) { setQty(id, 1); toast(t("added") + ": " + tr(byId[id].name)); }
    else if ((id = b.getAttribute("data-inc"))) setQty(id, (state.cart[id] || 0) + 1);
    else if ((id = b.getAttribute("data-dec"))) setQty(id, (state.cart[id] || 0) - 1);
    else if ((id = b.getAttribute("data-cat"))) {
      var sec = $("cat-" + id);
      if (sec) window.scrollTo({ top: sec.getBoundingClientRect().top + window.scrollY - 58, behavior: "smooth" });
    }
    else if ((id = b.getAttribute("data-lang"))) {
      if (id === state.lang) return;
      state.lang = id;
      save("lang", id);
      renderTexts();
      renderMenu();
      applySearch();
      updateFab(false);
    }
    else if (b.hasAttribute("data-close")) closeSheet(b.closest(".sheet").id);
  });

  $("cartFab").addEventListener("click", openCart);
  $("showWaiter").addEventListener("click", function () {
    closeSheet("cartSheet");
    setTimeout(showWaiter, 350);
  });
  $("clearCart").addEventListener("click", function () {
    if (confirm(t("confirmClear"))) { closeSheet("cartSheet"); clearCart(); }
  });
  $("orderNote").addEventListener("input", function (e) { state.note = e.target.value.slice(0, 300); persist(); });
  $("waiterBack").addEventListener("click", function () { closeSheet("waiter"); });
  $("shareOrder").addEventListener("click", shareOrder);
  $("doneOrder").addEventListener("click", function () { closeSheet("waiter"); clearCart(); });
  $("tableBadge").addEventListener("click", openTableAsk);
  $("tableSave").addEventListener("click", saveTable);
  $("tableInput").addEventListener("keydown", function (e) { if (e.key === "Enter") saveTable(); });

  var searchTimer;
  $("search").addEventListener("input", function () {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(applySearch, 80);
  });

  // ---------- Старт ----------
  renderTexts();
  renderMenu();
  updateFab(false);
  if (urlTable || urlLang) {
    // Убираем параметры из адреса, чтобы ссылка выглядела чисто
    try { history.replaceState(null, "", location.pathname); } catch (e) { /* ignore */ }
  }

  if ("serviceWorker" in navigator && location.protocol === "https:") {
    window.addEventListener("load", function () { navigator.serviceWorker.register("sw.js").catch(function () {}); });
  }
})();
