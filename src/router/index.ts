export const routes = [
  {
    path: '/sessions/:id',
    name: 'session-detail',
    component: () => import('@/views/SessionDetailView.vue'),
    props: true,
  },
  {
    path: '/',
    name: 'conference-overview',
    component: () => import('@/views/ConferenceOverviewView.vue'),
  },
  {
    path: '/speakers/:id',
    name: 'speaker-detail',
    component: () => import('@/views/SpeakerDetailView.vue'),
    props: true,
  },
  {
    path: '/my-programme',
    name: 'my-programme',
    component: () => import('@/views/PersonalProgrammeView.vue'),
  },
]
