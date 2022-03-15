const CACHE_NAME = "version-1";
const urlsToCache = [ 'index.html', 'offline.html' ];

const self = this;

//Install ServiceWorker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened Cache')

                return cache.addAll(urlsToCache)
            })
    )
});

//Listen for requests
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request) //matchea cada request, cada peticion tendra nueva data asi siempre hara una nueva peticion
            .then(() => {
                return fetch(event.request)
                    .catch(() => {caches.match('offline.html')})
            })
    )
});


//Activate the ServiceWorker
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [];
    cacheWhitelist.push(CACHE_NAME);

    event.waitUntil(
        caches.keys().then((cacheNames) => Promise.all(
            cacheNames.map((cacheName) => {
                if(!cacheWhitelist.includes(cacheName)){ //Si la whitelist no incluide el cachename entonces elimina el cacheName 
                    return caches.delete(cacheName)
                }
            })
        ))   
    )
});