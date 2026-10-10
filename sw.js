// Офлайн-кэш. После изменения меню увеличьте номер версии, чтобы гости сразу увидели новое.
var VERSION = "qrmenu-v1";
var FILES = ["./", "index.html", "styles.css", "app.js", "menu.js", "manifest.webmanifest", "icons/icon.svg", "icons/icon-192.png"];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

// Сначала сеть (свежие цены). Если интернет медленный (>2.5 с) или его нет — из кэша.
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  var network = fetch(e.request).then(function (res) {
    if (res.ok) {
      var copy = res.clone();
      caches.open(VERSION).then(function (c) { c.put(e.request, copy); });
    }
    return res;
  });
  var cached = new Promise(function (resolve) { setTimeout(resolve, 2500); }).then(function () {
    return caches.match(e.request, { ignoreSearch: true });
  });
  e.respondWith(
    Promise.race([network, cached.then(function (r) { return r || network; })]).catch(function () {
      return caches.match(e.request, { ignoreSearch: true });
    })
  );
});
