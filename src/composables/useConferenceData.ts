import { ref, computed } from 'vue'

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

  // Reaktiver State für die drei Filter
  // null bedeutet: "Kein Filter aktiv / Zeige alle"
  const selectedTrack = ref<string | null>(null)
  const selectedDay = ref<string | null>(null)
  const selectedLevel = ref<string | null>(null)

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

  // Die berechnete, gefilterte Liste
  const filteredSessions = computed(() => {
    return sessions.value.filter((session) => {
      // Wenn ein Filter gesetzt ist (nicht null), prüfe ob der Wert übereinstimmt.
      // Wenn der Filter null ist, setze match auf true (dieser Filter blockiert die Session nicht).
      const matchTrack = selectedTrack.value ? session.trackId === selectedTrack.value : true
      const matchDay = selectedDay.value ? session.day === selectedDay.value : true
      const matchLevel = selectedLevel.value ? session.level === selectedLevel.value : true

      // UND-Verknüpfung: Alle aktiven Bedingungen müssen true sein
      return matchTrack && matchDay && matchLevel
    })
  })

  // Optionales Quality-of-Life Feature: Alle Filter zurücksetzen
  const clearFilters = () => {
    selectedTrack.value = null
    selectedDay.value = null
    selectedLevel.value = null
  }

  return {
    sessions, // Das rohe Original-Array (wird meist nicht mehr direkt gerendert)
    filteredSessions, // <--- Die UI loopt (v-for) ab jetzt über DIESE Liste
    conferenceName,
    isLoading,
    error,
    selectedTrack, // Die UI bindet Dropdowns via v-model an diese Refs
    selectedDay,
    selectedLevel,
    clearFilters,
    loadData,
  }
}
