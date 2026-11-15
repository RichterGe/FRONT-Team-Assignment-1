/// <reference types="vite-ssg" />
import { readFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'

import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

import conferenceData from './src/data/conference-data.json' with { type: 'json' }

const conferenceDataPath = fileURLToPath(
  new URL('./src/data/conference-data.json', import.meta.url),
)

function serveConferenceDataPlugin(): Plugin {
  return {
    name: 'serve-conference-data',
    configureServer(server) {
      server.middlewares.use('/conference-data.json', (_req, res) => {
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.end(readFileSync(conferenceDataPath, 'utf-8'))
      })
    },
    generateBundle(_options, _bundle, isWrite) {
      if (!isWrite) return
      this.emitFile({
        type: 'asset',
        fileName: 'conference-data.json',
        source: readFileSync(conferenceDataPath, 'utf-8'),
      })
    },
  }
}

// CSS Tokens beim Build auslesen
const tokensCss = readFileSync(
  fileURLToPath(new URL('./tokens/tokens.css', import.meta.url)),
  'utf-8',
)

// Liest einen Token aus tokens.css und folgt var(--...) bis zum Hex-Wert.
// Wirft einen Fehler, wenn Tokens fehlen, umbenannt wurden oder zyklisch sind.
function token(name: string, seen = new Set<string>()): string {
  if (seen.has(name)) throw new Error(`Zyklische Token-Referenz bei ${name}`)
  seen.add(name)
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const value = tokensCss.match(new RegExp(`(?<![\\w-])${escaped}:\\s*([^;]+);`))?.[1]?.trim()
  if (!value) throw new Error(`Token ${name} fehlt in tokens.css`)
  const ref = value.match(/^var\((--[\w-]+)\)$/)?.[1]
  return ref ? token(ref, seen) : value
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    serveConferenceDataPlugin(),
    VitePWA({
      registerType: 'autoUpdate',

      // Icons, Favicon und Apple-Touch-Icon erfasst bereits workbox.globPatterns (B.1);
      // ohne diese Option stünden die Manifest-Icons doppelt in der Precache-Liste.
      includeManifestIcons: false,

      // Aufgabe A: Web App Manifest, Werte aus docs/schritt3/01-pwa-setup.md
      manifest: {
        name: 'GameFoundry — Forge Your Schedule',
        short_name: 'GameFoundry',
        description: 'Conference platform for game-development professionals.',
        lang: 'en',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: token('--color-bg'), // löst auf zu --blue-950
        theme_color: token('--color-surface-alt'), // löst auf zu --blue-900
        icons: [
          { src: 'icons/pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'icons/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable',},
        ],
      },
      workbox: {
        // B.1 Statische Assets & App-Shell → Cache-First über den Precache.
        // html = vorgerenderte Seiten (SSG), js = alle View-Chunks,
        // css = Bundle inkl. tokens.css, Bildformate = Icons und Favicon.
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],

        // B.2 conference-data.json gehört NICHT in den Precache:
        // Sie wird per Stale-While-Revalidate im Runtime-Cache bedient.
        // icons/logo.svg ist nur Ausgangsdatei für @vite-pwa/assets-generator.
        globIgnores: ['**/conference-data.json', '**/icons/logo.svg'],

        // Alte Precaches früherer Builds beim Aktivieren löschen
        cleanupOutdatedCaches: true,

        // B.3 "Mein Programm" (CSR, nicht vorgerendert): Jeder Seitenaufruf ohne
        // eigene Datei im Precache bekommt die gecachte App-Shell. Vue Router
        // rendert dann die passende View, die IDs kommen aus dem localStorage.
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/\/[^/?]+\.[^/]+$/],

        // B.2 Sessions-/Speaker-Daten → Stale-While-Revalidate (Task C / ADR-0006):
        // Liefert sofort den gecachten JSON-Stand (oder in Erstkonfiguration das Netz)
        // und aktualisiert conference-data.json im Hintergrund für Folgeaufrufe.
        runtimeCaching: [
          {
            urlPattern: ({ sameOrigin, url }) =>
              sameOrigin && url.pathname.endsWith('/conference-data.json'),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'conference-data-cache',
              expiration: {
                maxEntries: 5,
                // 7 Tage: deckt die zweitägige Konferenz inklusive Anreise ab,
                // ohne dass der Eintrag bei längerem Offline-Betrieb verworfen wird.
                maxAgeSeconds: 60 * 60 * 24 * 7,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  ssgOptions: {
    dirStyle: 'flat',
    includedRoutes(paths) {
      const staticRoutes = paths.filter((path) => !path.includes(':') && path !== '/my-programme')

      const speakerRoutes = conferenceData.speakers.map((speaker) => `/speakers/${speaker.id}`)

      const sessionRoutes = conferenceData.sessions.map((session) => `/sessions/${session.id}`)

      return [...staticRoutes, ...speakerRoutes, ...sessionRoutes]
    },
  },
})
