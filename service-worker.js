// //service-worker.js

// const cacheName = 'ecommerce-pwa-v1';
// const assetsToCache = [
//     '/',
//     '/index.html',
//     '/main.css',
//     '/app.js'
// ];

// self.addEventListener('install', event => {
//     event.waitUntil(
//         caches.open(cacheName)
//             .then(cache => {
//                 return cache.addAll(assetsToCache.map(url => new Request(url, {credentials: 'same-origin'})));
//             })
//             .catch(error => {
//                 console.error('Failed to cache assets:', error);
//             })
//     );
// });

// self.addEventListener('activate', event => {
//     event.waitUntil(
//         caches.keys().then(cacheNames => {
//             return Promise.all(
//                 cacheNames.filter(name => {
//                     return name !== cacheName;
//                 }).map(name => {
//                     return caches.delete(name);
//                 })
//             );
//         })
//     );
// });

// self.addEventListener('fetch', event => {
//     event.respondWith(
//         caches.match(event.request).then(cachedResponse => {
//             return cachedResponse || fetch(event.request);
//         })
//     );
// });

// self.addEventListener('push', function (event) {
// 	if (event && event.data) {
// 		var data = event.data.json();
// 		if (data.method == "pushMessage") {
// 			console.log("Push notification sent");
// 			event.waitUntil(self.registration.showNotification("E-commerce", {
// 				body:
// 					data.message
// 			}))
// 		}
// 	}
// })

self.addEventListener("install", function (event) {
  event.waitUntil(preLoad());
});
self.addEventListener("fetch", function (event) {
  event.respondWith(
    checkResponse(event.request).catch(function () {
      console.log("Fetch from cache successful!");
      return returnFromCache(event.request);
    })
  );
  console.log("Fetch successful!");
  event.waitUntil(addToCache(event.requesst));
});
self.addEventListener("sync", (event) => {
  if (event.tag === "syncMessage") {
    console.log("Sync successful!");
  }
});
self.addEventListener("push", function (event) {
  if (event && event.data) {
    try {
      var data = event.data.json();
      if (data && data.method === "pushMessage") {
        console.log("Push notification sent");
        self.registration.showNotification("Scribble", {
          body: data.message,
        });
      }
    } catch (error) {
      console.error("Error parsing push data:", error);
    }
  }
});
var preLoad = function () {
  return caches.open("offline").then(function (cache) {
    // caching index and important routes
    return cache.addAll(["/", "/index.html", "/main.css", "/script.js"]);
  });
};
var checkResponse = function (request) {
  return new Promise(function (fulfill, reject) {
    fetch(request)
      .then(function (response) {
        if (response.status !== 404) {
          fulfill(response);
        } else {
          reject(new Error("Response not found"));
        }
      })
      .catch(function (error) {
        reject(error);
      });
  });
};
var returnFromCache = function (request) {
  return caches.open("offline").then(function (cache) {
    return cache.match(request).then(function (matching) {
      if (!matching || matching.status == 404) {
        return cache.match("offline.html");
      } else {
        return matching;
      }
    });
  });
};
var addToCache = function (request) {
  return caches.open("offline").then(function (cache) {
    return fetch(request).then(function (response) {
      return cache.put(request, response.clone()).then(function () {
        return response;
      });
    });
  });
};
