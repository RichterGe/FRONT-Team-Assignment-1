import ConferenceOverviewView from '@/views/ConferenceOverviewView.vue'

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
    component: ConferenceOverviewView,
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
