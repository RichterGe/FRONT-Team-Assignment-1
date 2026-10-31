/// <reference types="vite-ssg" />
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

import conferenceData from './src/data/conference-data.json' with { type: 'json' }

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
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
