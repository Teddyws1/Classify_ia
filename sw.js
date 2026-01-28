const CACHE_VERSION = "v5"; // 🔁 mude quando atualizar
const CACHE_NAME = `app-cache-${CACHE_VERSION}`;

const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/style.css",
  "/app.js",
  "/manifest.json"
];

// ================= INSTALL =================
self.addEventListener("install", (event) => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// ================= ACTIVATE =================
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache); // 🧹 limpa cache antigo
          }
        })
      )
    )
  );

  self.clients.claim();
});

// ================= FETCH =================
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      // 1️⃣ se existir no cache → usa
      if (cached) return cached;

      // 2️⃣ senão → busca da internet
      return fetch(event.request)
        .then((response) => {
          // Salva no cache só se for válido
          if (
            response &&
            response.status === 200 &&
            response.type === "basic"
          ) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // 3️⃣ fallback offline
          if (event.request.mode === "navigate") {
            return caches.match("/index.html");
          }
        });
    })
  );
});
