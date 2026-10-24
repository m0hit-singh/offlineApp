const CACHE = "cache-v1";

const ASSETS = ["index.html"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => {
      return c.addAll(ASSETS);
    })
  );
});

/*self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== cacheNames) return caches.delete(cache);
        })
      );
    })
  );
});*/
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter(
            (cacheName) =>
              cacheName.startsWith(CACHE) &&
              cacheName !== CACHE
          )
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
});

/*self.addEventListener("fetch", (e) => {
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
});*/

// 3. Fetch: Network first, cache fallback
self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Handle only GET requests.
  if (request.method !== "GET") {
    return;
  }

  // Handle only requests to this website.
  const url = new URL(request.url);

  if (url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    (async () => {
      try {
        const response = await fetch(request);

        // Cache only successful responses.
        if (response.ok) {
          const cache = await caches.open(CACHE);

          await cache.put(request, response.clone());
        }

        return response;
      } catch (error) {
        // Network failed: try the cache.
        const cachedResponse = await caches.match(request);

        if (cachedResponse) {
          return cachedResponse;
        }

        // If an HTML navigation fails, show the offline page.
        /*if (request.mode === "navigate") {
          const offlinePage = await caches.match("/offline.html");

          if (offlinePage) {
            return offlinePage;
          }
        }*/

        // No cached resource is available.
        return new Response("You are offline and this resource is not cached.", {
          status: 503,
          headers: {
            "Content-Type": "text/plain; charset=utf-8"
          }
        });
      }
    })()
  );
});
