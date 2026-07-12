const CACHE="oitv-prototype-v04";
const ASSETS=["./","./index.html","./styles.css","./data.js","./app.js","./manifest.webmanifest",
"./assets/brand/primary-logo.png","./assets/brand/vinny-hero.png","./assets/brand/app-icon.png",
"./assets/people/andrew-antonio-ai.png","./assets/people/andrew-antonio-card.jpg","./VINNY_WELCOME_STANDARD.md"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener("fetch",e=>e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request))));
