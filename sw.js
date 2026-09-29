const CACHE_NAME = 'srj-pwa-v3.0.0';
const APP_SHELL = [
  './SRJ_Personnel_App3.0.html',
  './SRJ_Management_Dashboard.V3.0.0.html',
  './manifest.json',
  './manifest-admin.json',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
  './favicon-32.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

function isGithubApi(url) {
  return url.hostname === 'api.github.com';
}

function isExternalAsset(url) {
  return url.hostname === 'fonts.googleapis.com' ||
         url.hostname === 'fonts.gstatic.com' ||
         url.hostname === 'cdnjs.cloudflare.com';
}

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  // Never cache GitHub API / live database traffic.
  if (isGithubApi(url)) return;

  // Let third-party libraries/fonts use their normal browser caching.
  if (isExternalAsset(url)) return;

  // Only handle GET requests.
  if (request.method !== 'GET') return;

  // HTML navigation: network first, cached app shell as fallback.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then(cached => {
          if (cached) return cached;
          const path = url.pathname.toLowerCase();
          return caches.match(path.includes('management') ? './SRJ_Management_Dashboard.V3.0.0.html' : './SRJ_Personnel_App3.0.html');
        }))
    );
    return;
  }

  // Local static assets: cache first, then network.
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(response => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          }
          return response;
        });
      })
    );
  }
});
