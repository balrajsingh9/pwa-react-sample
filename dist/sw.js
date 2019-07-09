importScripts("precache-manifest.92103f49f687c4c1b2fe6cf841a52140.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

workbox.core.skipWaiting();
workbox.core.clientsClaim();

workbox.routing.registerRoute(
    new RegExp('https://hacker-news.firebaseio.com'),
    new workbox.strategies.StaleWhileRevalidate()
);

self.addEventListener('install', (e) => {

    e.waitUntil(new Promise((resolve) => {
        console.log('HOOHAA');
        setTimeout(resolve, 5000);
    }))
});

self.addEventListener('activate', (e) => {
    console.log('SW2 Active');
});

self.addEventListener('push', (event) => {
    const title = 'Get Started With Workbox';
    const options = {
        body: event.data.text()
    };
    event.waitUntil(self.registration.showNotification(title, options));
});

workbox.precaching.precacheAndRoute(self.__precacheManifest);