import '../tokens/tokens.css'
import './assets/main.css'

import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import { routes } from './router'

/**
Service-Worker-Registrierung (vite-plugin-pwa)


Nur im Browser: vite-ssg führt main.ts beim Build in Node aus,
dort gibt es kein navigator. Daher isClient-Check + dynamischer Import.

Erst nach router.isReady(), damit Hydration und erstes Rendern zuerst fertig sind.
onOfflineReady meldet, wann der Precache vollständig ist.

**/

export const createApp = ViteSSG(
  App,
  {
    routes,
    scrollBehavior(_to, _from, savedPosition) {
      if (savedPosition) return savedPosition
      return { top: 0 }
    },
  },
  ({ router }) => {
    // Aufgabe A: SW-Registrierung nur im Browser, nie während des SSG-Builds
    // import.meta.env.SSR ist beim Build true; isClient ist veraltet
    if (import.meta.env.SSR) return

    router.isReady().then(async () => {
      const { registerSW } = await import('virtual:pwa-register')
      registerSW({
        immediate: true,
        onOfflineReady() {
          console.info('[PWA] App-Shell im Cache, App ist offline bereit')
        },
      })
    })
  },
)
