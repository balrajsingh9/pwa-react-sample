importScripts("precache-manifest.7ee2811d44184894b910d4648e6918f1.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

workbox.core.skipWaiting();
workbox.core.clientsClaim();

workbox.routing.registerRoute(
    new RegExp('https://hacker-news.firebaseio.com'),
    new workbox.strategies.StaleWhileRevalidate()
);

self.addEventListener('install', (e) => {

    e.waitUntil(new Promise((resolve) => {
        console.log('Install1');
        setTimeout(resolve, 5000);
    }))
});

self.addEventListener('activate', (e) => {
    console.log('SW3 Active');
});

self.addEventListener('push', (event) => {
    const title = 'Get Started With Workbox';
    const options = {
        body: event.data.text()
    };
    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('message', function (event) {
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});

workbox.precaching.precacheAndRoute(self.__precacheManifest);
