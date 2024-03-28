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
  event.waitUntil(addToCache(event.request));
});

self.addEventListener("sync", (event) => {
  if (event.tag === "syncMessage") {
    console.log("Sync successful!");
  }
});

self.addEventListener("push", function (event) {
  if (event && event.data) {
    var data = event.data.json();
    if (data.method == "pushMessage") {
      console.log("Push notification sent");
      event.waitUntil(
        self.registration.showNotification("Omkar Sweets Corner", {
          body: data.message,
        })
      );
    }
  }
});

var ﬁlesToCache = [
  "/",
  "/index.html",
  "/style.css",
  "/app.js",
  "/blog.html",
  "/about.html",
  "/contact.html",
  "/menu.html",
  "/products.html",
  "/review.html",
  "/script.js",
];

var preLoad = function () {
  return caches.open("ofﬂine").then(function (cache) {
    // caching index and important routes
    return cache.addAll(ﬁlesToCache);
  });
};

var checkResponse = function (request) {
  return new Promise(function (fulﬁll, reject) {
    fetch(request).then(function (response) {
      if (response.status !== 404) {
        fulﬁll(response);
      } else {
        reject();
      }
    }, reject);
  });
};

var addToCache = function (request) {
  return caches.open("offline").then(function (cache) {
    return fetch(request).then(function (response) {
      return cache.put(request, response);
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
