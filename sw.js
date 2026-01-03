
// Minimal Service Worker for PWA Installation
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  // Pass-through strategy for the demo
  event.respondWith(fetch(event.request));
});
