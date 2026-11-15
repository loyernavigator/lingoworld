// Lembrete diário: o service worker do app (gerado pelo vite-plugin-pwa) carrega este
// arquivo com importScripts. Mostra a notificação e, ao tocar, abre o app no mapa.
self.addEventListener('push', (event) => {
  let data = {}
  try {
    data = event.data ? event.data.json() : {}
  } catch {
    data = { body: event.data ? event.data.text() : '' }
  }
  const base = self.registration.scope
  event.waitUntil(
    self.registration.showNotification(data.title || 'LingoWorld 🦊', {
      body: data.body || 'A Lingo está te esperando!',
      icon: base + 'icons/icon-192.png',
      badge: base + 'icons/icon-192.png',
      tag: data.tag || 'lingoworld-lembrete',
      renotify: false,
      lang: 'pt-BR',
      data: { url: base },
    }),
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = (event.notification.data && event.notification.data.url) || self.registration.scope
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const c of list) {
        if (c.url.startsWith(self.registration.scope) && 'focus' in c) return c.focus()
      }
      return self.clients.openWindow(url)
    }),
  )
})
