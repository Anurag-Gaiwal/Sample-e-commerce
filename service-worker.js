// service-worker.js


const cacheName = 'ecommerce-pwa-v1';
const assetsToCache = [
    '/',
    '/index.html',
    '/main.css',
    '/app.js'
    // Add more files and assets here as needed
];


self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName)
            .then(cache => {
                return cache.addAll(assetsToCache);
            })
    );
});


self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(name => {
                    return name !== cacheName;
                }).map(name => {
                    return caches.delete(name);
                })
            );
        })
    );
});
