import { computed, ref, type Ref } from 'vue'
import type { ConferenceSession } from './useConferenceData'

export function useSessionFilters(sessions: Ref<ConferenceSession[]>) {
	const selectedTrack = ref<string | null>(null)
	const selectedDay = ref<string | null>(null)
	const selectedLevel = ref<string | null>(null)

	const filteredSessions = computed(() =>
		sessions.value.filter((session) => {
			const matchesTrack = !selectedTrack.value || session.trackId === selectedTrack.value
			const matchesDay = !selectedDay.value || session.day === selectedDay.value
			const matchesLevel = !selectedLevel.value || session.level === selectedLevel.value

			return matchesTrack && matchesDay && matchesLevel
		}),
	)

	function clearFilters() {
		selectedTrack.value = null
		selectedDay.value = null
		selectedLevel.value = null
	}

	return {
		selectedTrack,
		selectedDay,
		selectedLevel,
		filteredSessions,
		clearFilters,
	}
}
