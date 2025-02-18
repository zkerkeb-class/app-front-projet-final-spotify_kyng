import { CacheFirst, NetworkFirst } from 'workbox-strategies';
import { precacheAndRoute } from 'workbox-precaching';

// Pré-cache des ressources essentielles (manifest, CSS, JS, etc.)
precacheAndRoute([
  '/index.html',
  '/styles/main.css',
  '/scripts/main.js',
  '/web-app-manifest-192x192.png',
  '/web-app-manifest-512x512.png',
  '/favicon.ico',
  '/images/logo.png',
]);

// Stratégie de mise en cache pour les images
const networkFirstHandler = new NetworkFirst({
  cacheName: 'image-cache',
  plugins: [
    {
      cacheWillUpdate: async ({ request, response }) => {
        // Si la réponse est valide, on la met en cache
        if (response && response.ok) {
          return response;
        }
        return null;  // Pas de mise en cache si la réponse est invalide
      },
    },
  ],
});

// Stratégie de mise en cache pour les autres ressources, en utilisant CacheFirst
const cacheFirstHandler = new CacheFirst({
  cacheName: 'asset-cache',
  plugins: [
    {
      cacheWillUpdate: async ({ request, response }) => {
        // Si la réponse est valide, on la met en cache
        if (response && response.ok) {
          return response;
        }
        return null;  // Pas de mise en cache si la réponse est invalide
      },
    },
  ],
});

// Ajout d'un événement "install" pour pré-cacher des fichiers
self.addEventListener('install', (event) => {
  console.log('Service Worker Installed');
  event.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/styles/main.css',
        '/scripts/main.js',
        '/web-app-manifest-192x192.png',
        '/web-app-manifest-512x512.png',
        '/favicon.ico',
        '/images/logo.png',
      ]);
    })
  );
});

// Ajout d'un événement "activate" pour gérer les caches obsolètes
self.addEventListener('activate', (event) => {
  console.log('Service Worker Activated');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== 'v1') {
            console.log('Service Worker: Clearing old cache');
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Gestion de la récupération des ressources via réseau ou cache
self.addEventListener('fetch', (event) => {
  // Si la requête concerne les images, on utilise la stratégie NetworkFirst
  if (event.request.url.includes('/api/images/')) {
    event.respondWith(networkFirstHandler.handle(event));
  } else {
    // Pour les autres requêtes, on utilise CacheFirst
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return (
          cachedResponse ||
          fetch(event.request)
            .then((networkResponse) => {
              return caches.open('asset-cache').then((cache) => {
                cache.put(event.request, networkResponse.clone());
                return networkResponse;
              });
            })
            .catch((error) => {
              console.error('Network request failed', error);
              // Si le réseau échoue, retourne une page de secours ou une ressource mise en cache
              return cachedResponse || caches.match('/offline.html');
            })
        );
      })
    );
  }
});
