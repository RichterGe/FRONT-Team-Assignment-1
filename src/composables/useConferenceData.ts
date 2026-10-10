import { ref } from 'vue'

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

export function useConferenceData() {
  const sessions = ref<ConferenceSession[]>([])
  const conferenceName = ref<string>('')
  const isLoading = ref(true)
  const error = ref<string | null>(null)

  const loadData = async () => {
    try {
      const response = await fetch('/conference-data.json')


      if (!response.ok) {
        error.value = `Fehler beim Laden: ${response.status} ${response.statusText}`
        return
      }

      const data = (await response.json()) as ConferenceData

      sessions.value = data.sessions
      conferenceName.value = data.conference.name
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = 'Ein unbekannter Fehler ist beim Laden aufgetreten.'
      }
    } finally {
      isLoading.value = false
    }
  }

  return {
    sessions,
    conferenceName,
    isLoading,
    error,
    loadData,
  }
}
