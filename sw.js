/* sw.js — service worker for EV Chargers Near Me.
   Strategy:
   - Core assets + city data (same-origin): stale-while-revalidate -> instant loads,
     works offline after first visit, quietly refreshes in the background.
   - HTML pages: network-first (fresh content), cache fallback offline.
   - Cross-origin (unpkg, OSM tiles, Nominatim/OSRM, Supabase): straight to network,
     never cached. */
var VERSION="ev-pwa-v1";
var CORE=[
  "/", "/index.html",
  "/theme.css", "/site.js", "/mapapp.js", "/feedback.js", "/theme.js", "/pwa.js",
  "/favicon.svg", "/icons/icon-192.png", "/icons/icon-512.png",
  "/manifest.webmanifest"
];
self.addEventListener("install",function(e){
  e.waitUntil(caches.open(VERSION).then(function(c){return c.addAll(CORE)}).then(function(){return self.skipWaiting()}).catch(function(){}));
});
self.addEventListener("activate",function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){return k!==VERSION}).map(function(k){return caches.delete(k)}));
  }).then(function(){return self.clients.claim()}));
});
self.addEventListener("fetch",function(e){
  if(e.request.method!=="GET")return;
  var url=new URL(e.request.url);
  if(url.origin!==location.origin)return;               /* cross-origin: pass through */
  if(url.pathname.indexOf("/data/")===0){               /* city data: stale-while-revalidate */
    e.respondWith(caches.open(VERSION).then(function(c){
      return c.match(e.request).then(function(hit){
        var net=fetch(e.request).then(function(r){ if(r.ok)c.put(e.request,r.clone()); return r; }).catch(function(){return hit});
        return hit||net;
      });
    }));return;
  }
  if(/\.(css|js|png|svg|webmanifest|ico|json)$/.test(url.pathname)||url.pathname==="/"){
    e.respondWith(caches.open(VERSION).then(function(c){
      return c.match(e.request).then(function(hit){
        var net=fetch(e.request).then(function(r){ if(r.ok)c.put(e.request,r.clone()); return r; }).catch(function(){return hit});
        return hit||net;
      });
    }));return;
  }
  /* HTML pages: network-first */
  e.respondWith(fetch(e.request).then(function(r){
    var cp=r.clone();caches.open(VERSION).then(function(c){c.put(e.request,cp)});return r;
  }).catch(function(){
    return caches.match(e.request).then(function(h){return h||caches.match("/index.html")});
  }));
});
