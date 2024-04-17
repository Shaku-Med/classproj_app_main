const CACHE_NAME = 'cacheme';
const urlsToCache = [
    '/',
    '/favicon.ico',
    '/tempo.mp3',
    'https://clpb.onrender.com/',
    'https://raw.githubusercontent.com/',
    'https://chatzy-silk.vercel.app/'
];

let ch = localStorage.getItem('cache')
if (ch) {
    urlsToCache.concat(ch);
}

self.addEventListener('install', event => {
    event.waitUntil(
        Promise.all(
            urlsToCache.map(url => {
                return fetch(url)
                    .then(response => {
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            throw new Error('Failed to fetch ' + url);
                        }
                        return caches.open(CACHE_NAME)
                            .then(cache => cache.put(url, response.clone()));
                    })
                    .catch(error => {
                        console.error('Failed to cache ' + url, error);
                    });
            })
        )
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
        .then(response => {
            if (response) {
                return response;
            }
            let fetchRequest = event.request.clone();
            return fetch(fetchRequest)
                .then(response => {
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    let responseToCache = response.clone();
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                    return response;
                });
        })
    );
});