// Lets the app work offline. The build fills in PRECACHE with the app's
// files and VERSION with a hash of them (see vite.config.js), so a new
// deployment installs a new worker and cache.
const VERSION = "af531378ca68";
const PRECACHE = ["./","assets/index-C5xkH583.js","assets/index-Gse1ip1e.js","assets/tag-ids-DHUJV8Rc.js","assets/detect-worker-BZRvuoLv.js","assets/index-BhoPTPaQ.css","assets/index-ClEg98Ll.css","assets/apriltag_wasm-Cq0nxUdg.wasm","favicon.svg","manifest.webmanifest","sample.jpg","icons/icon-192.png","icons/icon-512.png","icons/maskable-512.png","icons/apple-touch-icon.png"];
const CACHE = `apriltag-detector-${VERSION}`;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  if (new URL(request.url).origin !== location.origin) return;

  if (request.mode === 'navigate') {
    // The page itself: the network first so updates arrive, falling back to
    // the cached app when offline.
    event.respondWith(
      fetch(request).catch(
        async () => (await caches.match('./')) ?? Response.error()
      )
    );
    return;
  }

  // Everything else is versioned by the build, or never changes: the cache
  // first, adding anything new to it. Module scripts are requested with an
  // Origin header, which mustn't stop them matching a cached copy.
  event.respondWith(
    caches.match(request, { ignoreVary: true }).then(
      (cached) =>
        cached ??
        fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
    )
  );
});
