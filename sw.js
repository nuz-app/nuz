!function(e){var t={};function n(s){if(t[s])return t[s].exports;var r=t[s]={i:s,l:!1,exports:{}};return e[s].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,s){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:s})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var s=Object.create(null);if(n.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(s,r,function(t){return e[t]}.bind(null,r));return s},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="/",n(n.s=3)}([function(e,t,n){"use strict";try{self["workbox:precaching:5.1.4"]&&_()}catch(e){}},function(e,t,n){"use strict";try{self["workbox:core:5.1.4"]&&_()}catch(e){}},function(e,t){function n(e){return Promise.resolve().then((function(){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}))}n.keys=function(){return[]},n.resolve=n,e.exports=n,n.id=2},function(e,t,n){"use strict";n.r(t);n(0);n(1);const s={googleAnalytics:"googleAnalytics",precache:"precache-v2",prefix:"workbox",runtime:"runtime",suffix:"undefined"!=typeof registration?registration.scope:""},r=e=>[s.prefix,e,s.suffix].filter((e=>e&&e.length>0)).join("-"),a=e=>e||r(s.precache),c=(e,...t)=>{let n=e;return t.length>0&&(n+=` :: ${JSON.stringify(t)}`),n};class o extends Error{constructor(e,t){super(c(e,t)),this.name=e,this.details=t}}const i=new Set;const l=(e,t)=>e.filter((e=>t in e)),h=async({request:e,mode:t,plugins:n=[]})=>{const s=l(n,"cacheKeyWillBeUsed");let r=e;for(const e of s)r=await e.cacheKeyWillBeUsed.call(e,{mode:t,request:r}),"string"==typeof r&&(r=new Request(r));return r},u=async({cacheName:e,request:t,event:n,matchOptions:s,plugins:r=[]})=>{const a=await self.caches.open(e),c=await h({plugins:r,request:t,mode:"read"});let o=await a.match(c,s);for(const t of r)if("cachedResponseWillBeUsed"in t){const r=t.cachedResponseWillBeUsed;o=await r.call(t,{cacheName:e,event:n,matchOptions:s,cachedResponse:o,request:c})}return o},f=async({cacheName:e,request:t,response:n,event:s,plugins:r=[],matchOptions:a})=>{const c=await h({plugins:r,request:t,mode:"write"});if(!n)throw new o("cache-put-with-no-response",{url:(f=c.url,new URL(String(f),location.href).href.replace(new RegExp(`^${location.origin}`),""))});var f;const d=await(async({request:e,response:t,event:n,plugins:s=[]})=>{let r=t,a=!1;for(const t of s)if("cacheWillUpdate"in t){a=!0;const s=t.cacheWillUpdate;if(r=await s.call(t,{request:e,response:r,event:n}),!r)break}return a||(r=r&&200===r.status?r:void 0),r||null})({event:s,plugins:r,response:n,request:c});if(!d)return void 0;const p=await self.caches.open(e),y=l(r,"cacheDidUpdate"),w=y.length>0?await u({cacheName:e,matchOptions:a,request:c}):null;try{await p.put(c,d)}catch(e){throw"QuotaExceededError"===e.name&&await async function(){for(const e of i)await e()}(),e}for(const t of y)await t.cacheDidUpdate.call(t,{cacheName:e,event:s,oldResponse:w,newResponse:d,request:c})},d=async({request:e,fetchOptions:t,event:n,plugins:s=[]})=>{if("string"==typeof e&&(e=new Request(e)),n instanceof FetchEvent&&n.preloadResponse){const e=await n.preloadResponse;if(e)return e}const r=l(s,"fetchDidFail"),a=r.length>0?e.clone():null;try{for(const t of s)if("requestWillFetch"in t){const s=t.requestWillFetch,r=e.clone();e=await s.call(t,{request:r,event:n})}}catch(e){throw new o("plugin-error-request-will-fetch",{thrownError:e})}const c=e.clone();try{let r;r="navigate"===e.mode?await fetch(e):await fetch(e,t);for(const e of s)"fetchDidSucceed"in e&&(r=await e.fetchDidSucceed.call(e,{event:n,request:c,response:r}));return r}catch(e){0;for(const t of r)await t.fetchDidFail.call(t,{error:e,event:n,originalRequest:a.clone(),request:c.clone()});throw e}};let p;async function y(e,t){const n=e.clone(),s={headers:new Headers(n.headers),status:n.status,statusText:n.statusText},r=t?t(s):s,a=function(){if(void 0===p){const e=new Response("");if("body"in e)try{new Response(e.body),p=!0}catch(e){p=!1}p=!1}return p}()?n.body:await n.blob();return new Response(a,r)}function w(e){if(!e)throw new o("add-to-cache-list-unexpected-type",{entry:e});if("string"==typeof e){const t=new URL(e,location.href);return{cacheKey:t.href,url:t.href}}const{revision:t,url:n}=e;if(!n)throw new o("add-to-cache-list-unexpected-type",{entry:e});if(!t){const e=new URL(n,location.href);return{cacheKey:e.href,url:e.href}}const s=new URL(n,location.href),r=new URL(n,location.href);return s.searchParams.set("__WB_REVISION__",t),{cacheKey:s.href,url:r.href}}class g{constructor(e){this._cacheName=a(e),this._urlsToCacheKeys=new Map,this._urlsToCacheModes=new Map,this._cacheKeysToIntegrities=new Map}addToCacheList(e){const t=[];for(const n of e){"string"==typeof n?t.push(n):n&&void 0===n.revision&&t.push(n.url);const{cacheKey:e,url:s}=w(n),r="string"!=typeof n&&n.revision?"reload":"default";if(this._urlsToCacheKeys.has(s)&&this._urlsToCacheKeys.get(s)!==e)throw new o("add-to-cache-list-conflicting-entries",{firstEntry:this._urlsToCacheKeys.get(s),secondEntry:e});if("string"!=typeof n&&n.integrity){if(this._cacheKeysToIntegrities.has(e)&&this._cacheKeysToIntegrities.get(e)!==n.integrity)throw new o("add-to-cache-list-conflicting-integrities",{url:s});this._cacheKeysToIntegrities.set(e,n.integrity)}if(this._urlsToCacheKeys.set(s,e),this._urlsToCacheModes.set(s,r),t.length>0){const e=`Workbox is precaching URLs without revision info: ${t.join(", ")}\nThis is generally NOT safe. Learn more at https://bit.ly/wb-precache`;console.warn(e)}}}async install({event:e,plugins:t}={}){const n=[],s=[],r=await self.caches.open(this._cacheName),a=await r.keys(),c=new Set(a.map((e=>e.url)));for(const[e,t]of this._urlsToCacheKeys)c.has(t)?s.push(e):n.push({cacheKey:t,url:e});const o=n.map((({cacheKey:n,url:s})=>{const r=this._cacheKeysToIntegrities.get(n),a=this._urlsToCacheModes.get(s);return this._addURLToCache({cacheKey:n,cacheMode:a,event:e,integrity:r,plugins:t,url:s})}));await Promise.all(o);return{updatedURLs:n.map((e=>e.url)),notUpdatedURLs:s}}async activate(){const e=await self.caches.open(this._cacheName),t=await e.keys(),n=new Set(this._urlsToCacheKeys.values()),s=[];for(const r of t)n.has(r.url)||(await e.delete(r),s.push(r.url));return{deletedURLs:s}}async _addURLToCache({cacheKey:e,url:t,cacheMode:n,event:s,plugins:r,integrity:a}){const c=new Request(t,{integrity:a,cache:n,credentials:"same-origin"});let i,l=await d({event:s,plugins:r,request:c});for(const e of r||[])"cacheWillUpdate"in e&&(i=e);if(!(i?await i.cacheWillUpdate({event:s,request:c,response:l}):l.status<400))throw new o("bad-precaching-response",{url:t,status:l.status});l.redirected&&(l=await y(l)),await f({event:s,plugins:r,response:l,request:e===t?c:new Request(e),cacheName:this._cacheName,matchOptions:{ignoreSearch:!0}})}getURLsToCacheKeys(){return this._urlsToCacheKeys}getCachedURLs(){return[...this._urlsToCacheKeys.keys()]}getCacheKeyForURL(e){const t=new URL(e,location.href);return this._urlsToCacheKeys.get(t.href)}async matchPrecache(e){const t=e instanceof Request?e.url:e,n=this.getCacheKeyForURL(t);if(n){return(await self.caches.open(this._cacheName)).match(n)}}createHandler(e=!0){return async({request:t})=>{try{const e=await this.matchPrecache(t);if(e)return e;throw new o("missing-precache-entry",{cacheName:this._cacheName,url:t instanceof Request?t.url:t})}catch(n){if(e)return fetch(t);throw n}}}createHandlerBoundToURL(e,t=!0){if(!this.getCacheKeyForURL(e))throw new o("non-precached-url",{url:e});const n=this.createHandler(t),s=new Request(e);return()=>n({request:s})}}(async()=>{const e=function(){const e=JSON.parse(new URLSearchParams(self.location.search).get("params"));return e.debug&&console.log("[Docusaurus-PWA][SW]: Service Worker params:",e),e}(),t=[{"revision":"75513d35b84c4e09fd730a8750905dcf","url":"01a85c17.1c6726e0.js"},{"revision":"9ad79a75581102e92454515e78d0cd87","url":"0627f16b.0a996c3b.js"},{"revision":"970bd4becbbc03ba1c79cf11fd2c96e9","url":"1.ff1bf6d7.js"},{"revision":"05881a7489b83caf499446c1f1a46753","url":"10137f53.d414f14f.js"},{"revision":"7003e1548c23a520d56d6214dc3751aa","url":"1638ea00.e64e64f6.js"},{"revision":"7e65440e3c8c93e6519d46639691d34e","url":"17896441.0d4c2e3d.js"},{"revision":"134f0d1b3d5abfb25c5b37b9622203ac","url":"1df93b7f.4142b680.js"},{"revision":"2feda8196447cc14354412b277a241d2","url":"1ebc56d3.c2502478.js"},{"revision":"7c9659390ed79db0d9fada20bc2b4656","url":"2.d0de83e3.js"},{"revision":"6f854776525a2c236336a96dfc640b34","url":"207eed83.7c2021ce.js"},{"revision":"6c96b36d9707bb083c3d2b63eb7d7293","url":"253723d0.04482a4f.js"},{"revision":"4eeb8c61bf6bbd6648d21ea115d86277","url":"3.f9da5010.js"},{"revision":"6ae3ec86f1ec2b4c30712ea0e6409fa8","url":"30a24c52.3592826b.js"},{"revision":"f49ec9a841a95c0253225217c65bb906","url":"36.48aba2bd.js"},{"revision":"5376fcf33bdd5cd0604817526c09dec9","url":"37.a636fcd0.js"},{"revision":"c54f4728b71ca9efb2d2266745c9cea2","url":"38.f8fc5371.js"},{"revision":"68eb1d833d364fbacdfd2277672bed0d","url":"39.097c8d4a.js"},{"revision":"37066497de8fbe5b77e83ecfca33953c","url":"40.90c913ef.js"},{"revision":"9c2b67a8cffde8e27ae284cd343b43f2","url":"404.html"},{"revision":"f4bd2bc2f1f03738c02c6e8fcdd0157d","url":"41.cca6fcc1.js"},{"revision":"6909d89ab4794510280844ee7dda6fd2","url":"42.558b7047.js"},{"revision":"1050dec6dd8ca50e5aff37e11c1bc25a","url":"43.3acc1505.js"},{"revision":"d520c3f4797fe7892b19d792c42dc4da","url":"44.1a59c67c.js"},{"revision":"3ecfdc188642e416f0f52b060e19e7ec","url":"60c66209.e6d1cb42.js"},{"revision":"54f679c4abb3fd01e95732b9ff092023","url":"6875c492.03bd648e.js"},{"revision":"d0646fc1fe81e55bdbe1ab2b4c28272f","url":"6fbfa3c4.09730122.js"},{"revision":"f6ba050b5e26befdc80213ec5d2379d0","url":"935f2afb.05f2ce06.js"},{"revision":"0f5ab2a408bbc3cc331bcc648f0b4bb9","url":"9895ff1a.2fe5dee7.js"},{"revision":"a0235b8deb7d2301b8aa92a2f3cd1505","url":"a6aa9e1f.0ec0aa8f.js"},{"revision":"2dad923b63d31397aff4c79f222a99bf","url":"a7023ddc.b5ee922d.js"},{"revision":"3d729b4409c98383dbdcb19d4839ac0a","url":"ad895e75.3a73ea12.js"},{"revision":"f7bd985133006a72b40c3396cae741dd","url":"adf0676f.eb1a66e2.js"},{"revision":"31bfbb854a9885c9139fc387be40b09d","url":"b2b675dd.fb469f8d.js"},{"revision":"4aa51329338532c5f393a918f5b13dc9","url":"b42c8ea4.b11f91df.js"},{"revision":"3d9d2cc2d4bbaf9a73290427d2b28b0b","url":"b6287da9.bc9017c0.js"},{"revision":"b8efa5dd97b737b8da59507f680911af","url":"b6ed391b.6bcc43ae.js"},{"revision":"6d060c210adfbe6fa3387a01cf65e23e","url":"b9f6747f.96da06b8.js"},{"revision":"adf7332f17a55e96554b8f4c030fa332","url":"blog/index.html"},{"revision":"a42d8a2bc1b70d84b67be7afea1096fd","url":"blog/tags/hello/index.html"},{"revision":"44838695f0bfd723422cb10f90d2ad0b","url":"blog/tags/index.html"},{"revision":"e8ef6ea9f5acfbedd3b9cff8cd92a2ff","url":"blog/tags/nuz/index.html"},{"revision":"4d66fc1b0713edaa58929421ffeec923","url":"blog/welcome/index.html"},{"revision":"888f175bc3f9474e6665bd7850710cc5","url":"ccc49370.118b2cef.js"},{"revision":"491803cc0f3b347dc1442132bca2cb0a","url":"dc4fd637.10b4eb54.js"},{"revision":"2a25d3bd5d3e5002cc29133ada13799c","url":"doc1/index.html"},{"revision":"be4ea0bef00e34409e8e3f89a4622009","url":"e9236d31.a0fbc254.js"},{"revision":"9e820ceb7428e8fe06b5ef78826340f1","url":"f7dc5c79.fe5e7ffd.js"},{"revision":"f740057d020c7e98ec30336cd661c284","url":"f9fa61df.ede33e4d.js"},{"revision":"06d4870b4709f4011f139298a389995d","url":"fab90142.24f686b6.js"},{"revision":"f9f3498ec25e6695cb50827763c874dc","url":"faq/index.html"},{"revision":"dfc36095697c45139cf0c30b9f0f12f0","url":"guides/create-new-module/index.html"},{"revision":"f8655c54cdcac8ce7796fcf8c53495fd","url":"guides/micro-frontends-architecture/index.html"},{"revision":"afd1e0e72288f58d314077d97151e3f5","url":"guides/publish-a-module/index.html"},{"revision":"7f29faca7732136f621c311e8bcead6f","url":"index.html"},{"revision":"2a7319f855d694dbf8fa16ebbdc520e6","url":"introduction/concepts/index.html"},{"revision":"4bf9b19c984ee20fa8a0e0c0cf4a0e3d","url":"introduction/getting-started/index.html"},{"revision":"06d16be3d1ffa7a1181ba9348b59937a","url":"introduction/motivation/index.html"},{"revision":"5779aacb65a46be1a6a61e723d59d420","url":"introduction/overview/index.html"},{"revision":"69299c6ba5e13704abc62b7a01d90cea","url":"main.dac00fe5.js"},{"revision":"c18eda68458f26a19fc85e79c9566e23","url":"manifest.json"},{"revision":"e03af46622ffbb9ab9877b04abfc2cff","url":"reference/cli/index.html"},{"revision":"225891083d2553b4fcde8296d8985cef","url":"reference/core/index.html"},{"revision":"69cc2689335ce3e3c129c1b0efe243d2","url":"reference/module/index.html"},{"revision":"6c8560612f8ec0d96438defe1db05a4d","url":"reference/registry/index.html"},{"revision":"f891067a2f7c4ad1ad13eba20a70b6cd","url":"reference/workspaces/index.html"},{"revision":"4b8fcea1f9da042704230b34a83773a9","url":"runtime~main.97d754df.js"},{"revision":"9a5a9c41ef9c076fdc0f432d760885a9","url":"search/index.html"},{"revision":"de086fdc042cf5ceeef2558f741129e5","url":"services/nuz-registry/index.html"},{"revision":"afc8ed1781887835615b650fded33d39","url":"services/nuz-static/index.html"},{"revision":"ca82033d2d65a35a7f287162c923ce9f","url":"styles.16cfc216.css"},{"revision":"0692e73b118ece4c716f6e0d56c901ab","url":"styles.a748c341.js"},{"revision":"89b29210edfce5163ee07f7dbdaa3413","url":"yandex_1be6be3240000d3e.html"},{"revision":"beebbc6844f087b658e84633e41d9d79","url":"assets/images/micro-frontends-cover-d5774b685a2065f04614abe9d3b52202.jpg"},{"revision":"8076ccbbf67dc429e022ec33dca5c283","url":"assets/images/micro-frontends-facebook-896839e9ed5d05eb56e3c9ddfce5153f.jpg"},{"revision":"0b8c1f8a8f7773202daa35e87f3df6dd","url":"ideal-img/micro-frontends-cover.0b8c1f8.1920.jpg"},{"revision":"198354c1c2b04b21181a13083b4d9b75","url":"ideal-img/micro-frontends-cover.198354c.640.jpg"},{"revision":"2f6f78de6a8d8fb5907c206ef5b6a44f","url":"ideal-img/micro-frontends-cover.2f6f78d.1494.jpg"},{"revision":"50ae034f19f1d82bcfc7a43d9f8840ac","url":"ideal-img/micro-frontends-cover.50ae034.1067.jpg"},{"revision":"59a8bcecfe12e03a99b30caa2c8179c7","url":"ideal-img/micro-frontends-facebook.59a8bce.640.jpg"},{"revision":"a835a6e14feb38bfc880b64d1f50f524","url":"ideal-img/micro-frontends-facebook.a835a6e.1494.jpg"},{"revision":"b619d34f19f539f845df029553f82693","url":"ideal-img/micro-frontends-facebook.b619d34.1067.jpg"},{"revision":"e8ebb7c3e88e5d641738d0a583b76d43","url":"ideal-img/micro-frontends-facebook.e8ebb7c.1920.jpg"},{"revision":"c1c7c0ca019cadf91b419160c8eb0fec","url":"images/android-icon-144x144.png"},{"revision":"3cf3cbbd6099be56e091116f917f5034","url":"images/android-icon-192x192.png"},{"revision":"1f15ec1799c9c8931ddc105a3d796364","url":"images/android-icon-36x36.png"},{"revision":"e55ce25f27640e24a6b92bcd0e46751b","url":"images/android-icon-48x48.png"},{"revision":"e731027dc58f057d6334dc3325f6e11a","url":"images/android-icon-72x72.png"},{"revision":"ea0e8db36dd75faa7b367ed33cc46f5a","url":"images/android-icon-96x96.png"},{"revision":"1ff48ec5ee51ff683566ac627141a70d","url":"images/apple-icon-114x114.png"},{"revision":"daec85db58863a18d23996aebdb25693","url":"images/apple-icon-120x120.png"},{"revision":"c1c7c0ca019cadf91b419160c8eb0fec","url":"images/apple-icon-144x144.png"},{"revision":"77ec7029238569a134fca2b84a3b3a76","url":"images/apple-icon-152x152.png"},{"revision":"b7a70abe721ca410cc6546273c5b30fd","url":"images/apple-icon-180x180.png"},{"revision":"d673692599feb0394409a2847661235f","url":"images/apple-icon-57x57.png"},{"revision":"bd1118fa87c08d43f8c3b5aa9d2c5f83","url":"images/apple-icon-60x60.png"},{"revision":"e731027dc58f057d6334dc3325f6e11a","url":"images/apple-icon-72x72.png"},{"revision":"3d25832a54ff57deb8144b9bc9ed0d56","url":"images/apple-icon-76x76.png"},{"revision":"96412e7815cf388b32e0d210397563b8","url":"images/apple-icon-precomposed.png"},{"revision":"96412e7815cf388b32e0d210397563b8","url":"images/apple-icon.png"},{"revision":"9755acf1eae9a1ed51a4f37d6e960348","url":"images/favicon-16x16.png"},{"revision":"ad0b485569fefaeef8dc679ba333c47f","url":"images/favicon-32x32.png"},{"revision":"ea0e8db36dd75faa7b367ed33cc46f5a","url":"images/favicon-96x96.png"},{"revision":"9b0c362be152aeaa14f7456782423a0a","url":"images/favicon.ico"},{"revision":"ef37ea0c7f5f99a05fb825f00692c296","url":"images/logo-320x320.png"},{"revision":"f16b6f91df66720a54932c5a25209f13","url":"images/logo.png"},{"revision":"d53c087dac047796d58516ae09d8082a","url":"images/logo.svg"},{"revision":"c1c7c0ca019cadf91b419160c8eb0fec","url":"images/ms-icon-144x144.png"},{"revision":"f16b6f91df66720a54932c5a25209f13","url":"images/ms-icon-150x150.png"},{"revision":"e423a237df67949945913a73eeb18436","url":"images/ms-icon-310x310.png"},{"revision":"fd21ed0c332702c7843adc1eb707d6cf","url":"images/ms-icon-70x70.png"},{"revision":"72dd7dd6469075519748c0bfd2733057","url":"images/posts/cli-cover.png"},{"revision":"beebbc6844f087b658e84633e41d9d79","url":"images/posts/micro-frontends-cover.jpg"},{"revision":"8076ccbbf67dc429e022ec33dca5c283","url":"images/posts/micro-frontends-facebook.jpg"},{"revision":"0c77fd43e52c8ed69cd91d36b3d33864","url":"images/thumbnail.png"}],n=new g;e.offlineMode&&n.addToCacheList(t),await async function(e){}(),self.addEventListener("install",(e=>{e.waitUntil(n.install())})),self.addEventListener("activate",(e=>{e.waitUntil(n.activate())})),self.addEventListener("fetch",(async t=>{if(e.offlineMode){const s=t.request.url,r=function(e){const t=[],n=new URL(e,self.location.href);return n.origin!==self.location.origin||(n.search="",n.hash="",t.push(n.href),n.pathname.endsWith("/")?t.push(`${n.href}index.html`):t.push(`${n.href}/index.html`)),t}(s);for(let a=0;a<r.length;a+=1){const c=r[a],o=n.getCacheKeyForURL(c);if(o){e.debug&&console.log("[Docusaurus-PWA][SW]: serving cached asset",{requestURL:s,possibleURL:c,possibleURLs:r,cacheKey:o}),t.respondWith(caches.match(o));break}}}})),self.addEventListener("message",(async e=>{"SKIP_WAITING"===(e.data&&e.data.type)&&self.skipWaiting()}))})()}]);