<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import {
  type ConferenceSpeaker,
  type ConferenceRoom,
  type ConferenceTrack,
  useConferenceData,
} from '@/composables/useConferenceData'
import { usePersonalProgramme } from '@/composables/usePersonalProgramme'

const props = defineProps<{
  id: string
}>()

const { sessions, speakers, tracks, rooms, isLoading, error, loadData } = useConferenceData()
const { isBookmarked, toggleSession } = usePersonalProgramme()

onMounted(async () => {
  if (sessions.value.length === 0) {
    await loadData()
  }
})

const session = computed(() => sessions.value.find((s) => s.id === props.id))

const sessionSpeakers = computed<ConferenceSpeaker[]>(() => {
  if (!session.value?.speakerIds) return []
  return session.value.speakerIds
    .map((id) => speakers.value.find((sp) => sp.id === id))
    .filter((sp): sp is ConferenceSpeaker => sp !== undefined)
})

const sessionRoom = computed<ConferenceRoom | undefined>(() => {
  if (!session.value) return undefined
  return rooms.value.find((r) => r.id === session.value?.roomId)
})

const sessionTrack = computed<ConferenceTrack | undefined>(() => {
  if (!session.value) return undefined
  return tracks.value.find((t) => t.id === session.value?.trackId)
})
</script>

<template>
  <div class="session-detail-view">
    <nav class="breadcrumb">
      <RouterLink to="/">&larr; Back to overview</RouterLink>
    </nav>

    <div v-if="isLoading" class="card loading-state">
      <p>Loading session details...</p>
    </div>

    <div v-else-if="error" class="card error-message">
      <p>Error loading session: {{ error }}</p>
    </div>

    <article v-else-if="session" class="card session-article">
      <header class="session-header">
        <div class="session-header-top">
          <span class="session-badge">{{ session.format }} &bull; {{ session.level }}</span>
          <button
            type="button"
            class="btn-bookmark"
            :class="{ 'is-bookmarked': isBookmarked(session.id) }"
            :aria-pressed="isBookmarked(session.id)"
            @click="toggleSession(session.id)"
          >
            {{ isBookmarked(session.id) ? '★ In My Programme' : '☆ Add to Programme' }}
          </button>
        </div>
        <h1 class="session-title">{{ session.title }}</h1>
      </header>

      <section class="session-metadata">
        <div class="meta-row">
          <strong>Date & Time:</strong>
          <span>{{ session.day }}, {{ session.startTime }} – {{ session.endTime }}</span>
        </div>
        <div class="meta-row">
          <strong>Room:</strong>
          <span>{{ sessionRoom?.name ?? session.roomId }}</span>
        </div>
        <div class="meta-row">
          <strong>Track:</strong>
          <span>{{ sessionTrack?.name ?? session.trackId }}</span>
        </div>
      </section>

      <section class="session-abstract">
        <h3>Abstract</h3>
        <p>{{ session.abstract }}</p>
      </section>

      <section class="session-speakers" v-if="session.speakerIds && session.speakerIds.length > 0">
        <h3>Speaker</h3>
        <ul class="speaker-list">
          <li v-for="speaker in sessionSpeakers" :key="speaker.id">
            <RouterLink :to="`/speakers/${speaker.id}`" class="speaker-link">
              {{ speaker.name }}
            </RouterLink>
          </li>
        </ul>
      </section>
    </article>

    <div v-else class="card not-found-state">
      <h2>Session not found</h2>
      <p>No Session with id „{{ props.id }}“ found.</p>
      <RouterLink to="/" class="button-primary">Back to overview</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.session-detail-view {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
}

.breadcrumb a {
  color: var(--color-action-primary);
  text-decoration: none;
  font-size: var(--text-label);
}

.breadcrumb a:hover {
  text-decoration: underline;
}

.session-header {
  margin-bottom: var(--space-16);
}

.session-header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-8);
  margin-bottom: var(--space-8);
}

.session-badge {
  display: inline-block;
  font-size: var(--text-metadata);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.75;
}

.btn-bookmark {
  background: transparent;
  color: var(--color-action-primary);
  border: 1px solid var(--color-action-primary);
  padding: var(--space-4);
  border-radius: 4px;
  cursor: pointer;
  font-size: var(--text-label);
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-bookmark:hover {
  background: var(--color-action-primary-hover);
  color: var(--color-action-primary-text);
}

.btn-bookmark.is-bookmarked {
  background: var(--color-action-primary);
  color: var(--color-action-primary-text);
}

.btn-bookmark.is-bookmarked:hover {
  background: var(--color-accent-warm);
  border-color: var(--color-accent-warm);
  color: var(--color-bg);
}

.session-title {
  color: var(--color-action-primary);
  margin: 0;
  font-size: var(--text-heading-page);
}

.session-metadata {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  padding: var(--space-16) 0;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  margin-bottom: var(--space-16);
}

.meta-row {
  display: flex;
  gap: var(--space-8);
}

.session-abstract p {
  line-height: 1.6;
}

.speaker-list {
  list-style: none;
  padding: 0;
  margin: var(--space-8) 0 0 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.speaker-link {
  color: var(--color-action-primary);
  text-decoration: none;
}

.speaker-link:hover {
  text-decoration: underline;
}
</style>
