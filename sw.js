const CACHE_VERSION = "v4"; // 🔁 MUDE AQUI quando atualizar o site
const CACHE_NAME = `app-cache-${CACHE_VERSION}`;

const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/style.css",
  "/app.js",
  // adicione outros arquivos importantes
];

// INSTALA
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    }),
  );

  self.skipWaiting(); // ativa a nova versão imediatamente
});

// ATIVA → limpa cache antigo
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache); // 🧹 limpa cache velho
          }
        }),
      );
    }),
  );

  self.clients.claim(); // controla todas as abas abertas
});

// FETCH
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      }),
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(fetch(event.request));
});
