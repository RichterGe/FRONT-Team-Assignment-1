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

// Shared module-level reactive state (global cache across components)
const sessions = ref<ConferenceSession[]>(conferenceData.sessions)
const speakers = ref<ConferenceSpeaker[]>(conferenceData.speakers)
const tracks = ref<ConferenceTrack[]>(conferenceData.tracks)
const rooms = ref<ConferenceRoom[]>(conferenceData.rooms)
const conferenceName = ref<string>(conferenceData.conference.name)
const isLoading = ref<boolean>(false)
const error = ref<string | null>(null)

export function useConferenceData() {
  const loadData = () => {
    sessions.value = conferenceData.sessions
    speakers.value = conferenceData.speakers
    tracks.value = conferenceData.tracks
    rooms.value = conferenceData.rooms
    conferenceName.value = conferenceData.conference.name
    isLoading.value = false
    error.value = null
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
