self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("tasbeeh-cache").then((cache) =>
      cache.addAll([
        "/",
        "/index.html",
        "/icon-192.png",
        "/icon-512.png",
        "/manifest.json"
      ])
    )
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
