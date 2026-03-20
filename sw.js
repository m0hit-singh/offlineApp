const CACHE = "cache-v1";

const ASSETS = ["index.html"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => {
      return c.addAll(ASSETS);
    })
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== cacheNames) return caches.delete(cache);
        })
      );
    })
  );
});

self.addEventListener("fetch", (e) => {
  if (!e.request.url.startsWith("http")) return;

  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const resClone = res.clone();

        caches.open(CACHE).then((cache) => cache.put(e.request, resClone));
        return res;
      })
      .catch((err) => {
        return caches.match(e.request).then((res) => res);
      })
  );
});
