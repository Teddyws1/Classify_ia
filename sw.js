const CACHE_NAME = "classify-ia-v1";

const FILES_TO_CACHE = [
  "/Classify_ia/",
  "/Classify_ia/index.html",
  "/Classify_ia/style.css",
  "/Classify_ia/script.js",
  "/Classify_ia/manifest.json",
  "/Classify_ia/icons/icon-192.png",
  "/Classify_ia/icons/icon-512.png"
];

// INSTALA
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// ATIVA
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// FETCH
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(
      (response) => response || fetch(event.request)
    )
  );
});
