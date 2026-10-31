<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import SpeakerCard from '@/components/features/speakers/SpeakerCard.vue'
import { useConferenceData } from '@/composables/useConferenceData'

const props = defineProps<{
  id: string
}>()

const { speakers, sessions } = useConferenceData()

const speaker = computed(() => speakers.value.find((item) => item.id === props.id))

const speakerSessions = computed(() => {
  if (!speaker.value) return []

  return speaker.value.sessionIds
    .map((sessionId) => sessions.value.find((session) => session.id === sessionId))
    .filter((session) => session !== undefined)
    .sort((first, second) => {
      const byDay = first.day.localeCompare(second.day)
      return byDay || first.startTime.localeCompare(second.startTime)
    })
})
</script>

<template>
  <main class="speaker-profile">
    <nav class="speaker-profile__breadcrumb" aria-label="Breadcrumb">
      <RouterLink :to="{ name: 'conference-overview' }">Back to sessions</RouterLink>
    </nav>

    <article v-if="speaker" class="speaker-profile__content">
      <SpeakerCard :speaker="speaker" />

      <section aria-labelledby="speaker-sessions-title">
        <h2 id="speaker-sessions-title">Sessions</h2>
        <p v-if="speakerSessions.length === 0">No sessions are currently listed.</p>
        <ul v-else class="speaker-profile__sessions">
          <li v-for="session in speakerSessions" :key="session.id">
            <RouterLink :to="{ name: 'session-detail', params: { id: session.id } }">
              <span class="speaker-profile__session-time">
                {{ session.day }} · {{ session.startTime }}–{{ session.endTime }}
              </span>
              <span class="speaker-profile__session-title">{{ session.title }}</span>
            </RouterLink>
          </li>
        </ul>
      </section>
    </article>

    <section v-else class="speaker-profile__not-found" aria-labelledby="not-found-title">
      <h1 id="not-found-title">Speaker not found</h1>
      <p>No speaker with ID “{{ props.id }}” exists.</p>
    </section>
  </main>
</template>

<style scoped>
.speaker-profile {
  display: grid;
  gap: var(--space-24);
}

.speaker-profile__breadcrumb a,
.speaker-profile__sessions a {
  color: var(--color-action-primary);
  text-decoration: none;
}

.speaker-profile__breadcrumb a:hover,
.speaker-profile__sessions a:hover .speaker-profile__session-title {
  text-decoration: underline;
}

.speaker-profile__content {
  display: grid;
  gap: var(--space-32);
}

.speaker-profile__session-time {
  color: var(--color-text-muted);
}

.speaker-profile__content section h2 {
  margin-bottom: var(--space-8);
  font-size: var(--text-heading-section);
}

.speaker-profile__sessions {
  display: grid;
  gap: var(--space-8);
  padding: 0;
  list-style: none;
}

.speaker-profile__sessions a {
  display: grid;
  gap: var(--space-4);
  padding: var(--space-16);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
}

.speaker-profile__session-title {
  color: var(--color-text-primary);
}

.speaker-profile__not-found {
  padding: var(--space-24);
  border-left: 3px solid var(--color-accent-warm);
  background: var(--color-surface);
}
</style>
