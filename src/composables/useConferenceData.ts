import { ref } from 'vue'
import conferenceDataJson from '@/data/conference-data.json'

export interface ConferenceTrack {
  id: string
  name: string
}

export interface ConferenceRoom {
  id: string
  name: string
  capacity: number
}

export interface ConferenceSpeaker {
  id: string
  name: string
  title: string
  company: string
  bio: string
  sessionIds: string[]
}

export interface ConferenceSession {
  id: string
  title: string
  abstract: string
  trackId: string
  speakerIds: string[]
  day: string
  startTime: string
  endTime: string
  roomId: string
  level: string
  format: string
}

export interface ConferenceData {
  conference: {
    name: string
    tagline: string
    dates: string[]
    location: string
    timezone: string
  }
  tracks: ConferenceTrack[]
  rooms: ConferenceRoom[]
  speakers: ConferenceSpeaker[]
  sessions: ConferenceSession[]
}

const conferenceData = conferenceDataJson as ConferenceData

// Shared module-level reactive state (seeded with build-time JSON for SSG, revalidated via CSR fetch)
const sessions = ref<ConferenceSession[]>(conferenceData.sessions)
const speakers = ref<ConferenceSpeaker[]>(conferenceData.speakers)
const tracks = ref<ConferenceTrack[]>(conferenceData.tracks)
const rooms = ref<ConferenceRoom[]>(conferenceData.rooms)
const conferenceName = ref<string>(conferenceData.conference.name)
const isLoading = ref<boolean>(false)
const error = ref<string | null>(null)
let loadPromise: Promise<void> | null = null

export function useConferenceData() {
  const loadData = async (): Promise<void> => {
    // During SSG build (Node environment), static build-time data is already populated
    if (typeof window === 'undefined') {
      return
    }

    if (loadPromise) {
      return loadPromise
    }

    const hasStaleData = sessions.value.length > 0
    if (!hasStaleData) {
      isLoading.value = true
    }
    error.value = null

    const handleLoadError = (err: unknown): void => {
      if (!hasStaleData) {
        error.value =
          err instanceof Error
            ? err.message
            : 'An unknown error occurred while loading conference data.'
      } else {
        console.warn('Revalidation of conference-data.json failed; keeping static build data.', err)
      }
    }

    loadPromise = (async () => {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}conference-data.json`)

        if (!response.ok) {
          handleLoadError(
            new Error(`Failed to load conference data: ${response.status} ${response.statusText}`),
          )
          return
        }

        const data = (await response.json()) as ConferenceData

        sessions.value = data.sessions
        speakers.value = data.speakers
        tracks.value = data.tracks
        rooms.value = data.rooms
        conferenceName.value = data.conference.name
      } catch (err: unknown) {
        handleLoadError(err)
      } finally {
        isLoading.value = false
        loadPromise = null
      }
    })()

    return loadPromise
  }

  return {
    sessions, // Das rohe Original-Array
    speakers,
    tracks,
    rooms,
    conferenceName,
    isLoading,
    error,
    loadData,
  }
}
