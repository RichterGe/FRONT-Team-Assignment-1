import { ref, computed, watch } from 'vue'
import { useConferenceData, type ConferenceSession } from './useConferenceData'

const STORAGE_KEY = 'gamefoundry_my_programme'

// Shared module-level reactive state across components
const savedSessionIds = ref<string[]>([])
let isInitialized = false

export function usePersonalProgramme() {
  const { sessions, isLoading, loadData } = useConferenceData()

  // 1. Rehydration: Load stored IDs on initial client start
  if (!isInitialized && typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        savedSessionIds.value = JSON.parse(raw)
      }
    } catch (err) {
      console.error('Failed to parse saved sessions from localStorage:', err)
      savedSessionIds.value = []
    }
    isInitialized = true
  }

  // 2. Synchronization: Keep localStorage in sync with reactive state
  if (typeof window !== 'undefined') {
    watch(
      savedSessionIds,
      (newIds) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newIds))
      },
      { deep: true },
    )
  }

  // 3. Computed view: Reconstruct full session objects
  const mySessions = computed<ConferenceSession[]>(() => {
    return sessions.value
      .filter((session) => savedSessionIds.value.includes(session.id))
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
  })

  // Action methods
  const isBookmarked = (sessionId: string): boolean => {
    return savedSessionIds.value.includes(sessionId)
  }

  const toggleSession = (sessionId: string) => {
    const index = savedSessionIds.value.indexOf(sessionId)
    if (index === -1) {
      savedSessionIds.value.push(sessionId)
    } else {
      savedSessionIds.value.splice(index, 1)
    }
  }

  const removeSession = (sessionId: string) => {
    savedSessionIds.value = savedSessionIds.value.filter((id) => id !== sessionId)
  }

  return {
    savedSessionIds,
    mySessions,
    isLoading,
    loadData,
    isBookmarked,
    toggleSession,
    removeSession,
  }
}
