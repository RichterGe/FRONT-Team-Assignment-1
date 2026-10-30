import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/sessions/:id',
    name: 'session-detail',
    component: () => import('@/views/SessionDetailView.vue'),
    props: true,
  },
  // Weitere Routen: {
  //     path: '/',
  //     name: 'conference-overview',
  //     component: () => import('@/views/ConferenceOverviewView.vue'),
  //   },
  // {
  //   path: '/speakers/:id',
  //   name: 'speaker-detail',
  //   component: () => import('@/views/SpeakerDetailView.vue'),
  //   props: true,
  // },
  // {
  //   path: '/my-programme',
  //   name: 'my-programme',
  //   component: () => import('@/views/PersonalProgrammeView.vue'),
  // },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  },
})

export default router
