/// <reference types="vite-ssg" />
import { readFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'

import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

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

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    serveConferenceDataPlugin(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  ssgOptions: {
    dirStyle: 'nested',
    includedRoutes(paths) {
      const staticRoutes = paths.filter(
        (path) => !path.includes(':') && path !== '/my-programme',
      )

      const speakerRoutes = conferenceData.speakers.map(
        (speaker) => `/speakers/${speaker.id}`,
      )

      const sessionRoutes = conferenceData.sessions.map(
        (session) => `/sessions/${session.id}`,
      )

      return [...staticRoutes, ...speakerRoutes, ...sessionRoutes]
    },
  },
})
