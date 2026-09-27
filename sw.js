// سرویس‌ورکر ساده برای نصب‌پذیری (PWA) و کش پوسته برنامه
// توجه: داده‌های زنده (کارکرد، KPI، تاییدها) همیشه از گیت‌هاب و به‌صورت آنلاین خوانده می‌شود؛
// این کش فقط ظاهر برنامه را برای بازشدن سریع‌تر و حالت آفلاینِ محدود نگه می‌دارد.
const CACHE_NAME = 'srj-personnel-shell-v1';
const APP_SHELL = [
  './SRJ_Personnel_App.html',
  './SRJ_Widget.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  // برای فراخوانی‌های API گیت‌هاب همیشه شبکه را امتحان کن (بدون کش کردن پاسخ‌های داده)
  if (event.request.url.includes('api.github.com')) return;

  event.respondWith(
    fetch(event.request)
      .then((res) => {
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
