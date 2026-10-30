import './assets/main.css'

import { ViteSSG } from 'vite-ssg'
import '../tokens/tokens.css'
import App from './App.vue'
import { routes } from './router'

export const createApp = ViteSSG(App, {
	routes,
	scrollBehavior(_to, _from, savedPosition) {
		if (savedPosition) return savedPosition
		return { top: 0 }
	},
})
