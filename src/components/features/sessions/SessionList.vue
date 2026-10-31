<script setup lang="ts">
import type { ConferenceSession, ConferenceTrack } from '@/composables/useConferenceData'
import SessionCard from './SessionCard.vue'

const props = defineProps<{
  sessions: ConferenceSession[]
  tracks: ConferenceTrack[]
  bookmarkedIds: string[]
}>()

const emit = defineEmits<{
  toggleBookmark: [sessionId: string]
}>()

function trackName(trackId: string): string {
  return props.tracks.find((track) => track.id === trackId)?.name ?? trackId
}

function isBookmarked(sessionId: string): boolean {
  return props.bookmarkedIds.includes(sessionId)
}
</script>

<template>
  <ul class="session-list">
    <li v-for="session in sessions" :key="session.id">
      <SessionCard
        :session="session"
        :track-name="trackName(session.trackId)"
        :is-bookmarked="isBookmarked(session.id)"
        @toggle-bookmark="emit('toggleBookmark', $event)"
      />
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
