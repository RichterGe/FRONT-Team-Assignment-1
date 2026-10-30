<script setup lang="ts">
import type { ConferenceSession, ConferenceTrack } from '@/composables/useConferenceData'
import SessionCard from './SessionCard.vue'

const props = defineProps<{
	sessions: ConferenceSession[]
	tracks: ConferenceTrack[]
}>()

function trackName(trackId: string): string {
	return props.tracks.find((track) => track.id === trackId)?.name ?? trackId
}
</script>

<template>
	<ul class="session-list">
		<li v-for="session in sessions" :key="session.id">
			<SessionCard :session="session" :track-name="trackName(session.trackId)" />
		</li>
	</ul>
</template>

<style scoped>
.session-list {
	display: grid;
	gap: var(--space-16);
	padding: 0;
	list-style: none;
}
</style>
