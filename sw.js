self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open("meu-pwa-cache").then((cache) => {
            return cache.addAll([
                "/",
                "/apk.html",
     "/media.html",
                "/Icon.png",
                "/Icon.png"
            ]);
        })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});