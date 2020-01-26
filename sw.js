// Service Worker with Cache-first network

var cacheName = "stopTinnitusPrecache";
var precacheFiles = [
  /* Array of files to precache */
  "/labs/stoptinnitus/",
  "/labs/stoptinnitus/index.html",
  "/labs/stoptinnitus/detect.html",
  "/labs/stoptinnitus/therapy.html",
  "/labs/stoptinnitus/src/",
  "/labs/stoptinnitus/src/scripts/main.js"
];

//Install stage sets up the cache-array to configure pre-cache content
self.addEventListener("install", function(event) {
  console.log("The service worker is being installed.");
  event.waitUntil(
    precache().then(function() {
      console.log("Skip waiting on install");
      return self.skipWaiting();
    })
  );
});

// Allow sw to control current page
self.addEventListener("activate", function(event) {
  console.log("Claiming clients for current page");
  return self.clients.claim();
});

/* self.addEventListener("fetch", function(event) {
  console.log("The service worker is serving the asset." + event.request.url);
  event.respondWith(fromCache(event.request).catch(fromServer(event.request)));
  event.waitUntil(update(event.request));
}); */

self.addEventListener("fetch", function(event) {
  console.log("The service worker is serving the asset." + event.request.url);
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});

function precache() {
  return caches.open(cacheName).then(function(cache) {
    return cache.addAll(precacheFiles);
  });
}

function fromCache(request) {
  //we pull files from the cache first thing so we can show them fast
  return caches.open(cacheName).then(function(cache) {
    return cache.match(request).then(function(matching) {
      return matching || Promise.reject("no-match");
    });
  });
}

function update(request) {
  //this is where we call the server to get the newest version of the
  //file to use the next time we show view
  return caches.open(cacheName).then(function(cache) {
    return fetch(request).then(function(response) {
      return cache.put(request, response);
    });
  });
}

function fromServer(request) {
  //this is the fallback if it is not in the cache to go to the server and get it
  return fetch(request).then(function(response) {
    return response;
  });
}
