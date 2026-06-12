const cacheName = "gwalsa-routine-v20260612a05";
const assets = [
  "./",
  "./index.html",
  "./styles.css?v=20260612a05",
  "./app.js?v=20260612a05",
  "./manifest.json",
  "./assets/icon.svg",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/apple-touch-icon.png",
  "./assets/models/face-landmarker/face-landmarker.task",
  "./assets/vendor/mediapipe/tasks-vision/0.10.35/vision_bundle.mjs",
  "./assets/vendor/mediapipe/tasks-vision/0.10.35/wasm/vision_wasm_internal.js",
  "./assets/vendor/mediapipe/tasks-vision/0.10.35/wasm/vision_wasm_internal.wasm",
  "./assets/vendor/mediapipe/tasks-vision/0.10.35/wasm/vision_wasm_module_internal.js",
  "./assets/vendor/mediapipe/tasks-vision/0.10.35/wasm/vision_wasm_module_internal.wasm",
  "./assets/vendor/mediapipe/tasks-vision/0.10.35/wasm/vision_wasm_nosimd_internal.js",
  "./assets/vendor/mediapipe/tasks-vision/0.10.35/wasm/vision_wasm_nosimd_internal.wasm",
  "./public/privacy-policy.html",
  "./public/terms-disclaimer.html",
  "./public/support.html",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(assets)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== cacheName).map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

function getNavigationFallback(requestUrl) {
  const cachedAsset = assets.find((asset) => {
    const assetUrl = new URL(asset, self.location.href);
    return assetUrl.origin === requestUrl.origin && assetUrl.pathname === requestUrl.pathname;
  });
  return cachedAsset || "./index.html";
}

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  let requestUrl;
  try {
    requestUrl = new URL(event.request.url);
  } catch {
    return;
  }
  const isHttpLike = requestUrl.protocol === "http:" || requestUrl.protocol === "https:";
  if (!isHttpLike) return;
  const isSameOrigin = requestUrl.origin === self.location.origin;
  if (!isSameOrigin) return;
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(async () => {
        const directMatch = await caches.match(event.request);
        if (directMatch) return directMatch;
        return caches.match(getNavigationFallback(requestUrl));
      })
    );
    return;
  }
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (isSameOrigin && response.ok) {
          const copy = response.clone();
          caches.open(cacheName).then((cache) => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
