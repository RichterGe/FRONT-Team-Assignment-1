<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useConferenceData } from '@/composables/useConferenceData'
import { useSessionFilters } from '@/composables/useSessionFilters'
import SessionFilters from '@/components/features/sessions/SessionFilters.vue'
import SessionList from '@/components/features/sessions/SessionList.vue'

const {
  sessions,
  tracks,
  isLoading,
  error,
  loadData,
} = useConferenceData()

const {
  selectedTrack,
  selectedDay,
  selectedLevel,
  filteredSessions,
  clearFilters,
} = useSessionFilters(sessions)

const days = computed(() => [...new Set(sessions.value.map((session) => session.day))].sort())

const levels = computed(() => [...new Set(sessions.value.map((session) => session.level))].sort())

onMounted(() => {
  void loadData()
})
</script>

<template>
  <section class="overview" aria-labelledby="overview-title">
    <header class="overview__header">
      <p class="overview__eyebrow">Conference programme</p>
      <h2 id="overview-title">Sessions</h2>
    </header>

    <p v-if="isLoading" role="status">Loading sessions...</p>
    <p v-else-if="error" role="alert">Could not load sessions: {{ error }}</p>
    <template v-else>
      <SessionFilters
        :tracks="tracks"
        :days="days"
        :levels="levels"
        v-model:selected-track="selectedTrack"
        v-model:selected-day="selectedDay"
        v-model:selected-level="selectedLevel"
        @clear="clearFilters"
      />

      <p class="overview__count" aria-live="polite">
        Showing {{ filteredSessions.length }} of {{ sessions.length }} sessions
      </p>

      <p v-if="filteredSessions.length === 0" class="overview__empty">
        No sessions match these filters.
      </p>
      <SessionList v-else :sessions="filteredSessions" :tracks="tracks" />
    </template>
  </section>
</template>

<style scoped>
.overview {
  width: 100%;
}

.overview__header {
  margin-bottom: var(--space-24);
}

.overview__eyebrow,
.session-list__meta {
  color: var(--color-text-muted);
  font-size: var(--text-metadata);
}

.overview__header h2 {
  margin-top: var(--space-8);
  color: var(--color-hero-highlight);
  font-size: var(--text-heading-page);
}

.overview__count {
  margin-bottom: var(--space-16);
  color: var(--color-text-secondary);
}

.overview__empty {
  padding: var(--space-24);
  border-left: 3px solid var(--color-accent-warm);
  background: var(--color-surface);
}

</style>


