<script setup lang="ts">
import type { ConferenceSession } from '@/composables/useConferenceData'
import BaseCard from '../../base/BaseCard.vue'
import { RouterLink } from 'vue-router'

defineProps<{
  session: ConferenceSession
  trackName: string
}>()
</script>

<template>
  <BaseCard class="session-card">
    <template #header>
      <p class="session-card__meta">
        {{ session.day }} · {{ session.startTime }}–{{ session.endTime }} · {{ trackName }} ·
        {{ session.level }}
      </p>
      <h3 class="session-card__title">
        <RouterLink :to="{ name: 'session-detail', params: { id: session.id } }">
          {{ session.title }}
        </RouterLink>
      </h3>
    </template>
    <p class="session-card__abstract">{{ session.abstract }}</p>
  </BaseCard>
</template>

<style scoped>
.session-card__meta {
  color: var(--color-text-muted);
  font-size: var(--text-metadata);
}

.session-card__title {
  margin-top: var(--space-8);
  font-size: var(--text-heading-small);
}

.session-card__title a {
  color: var(--color-action-primary);
  text-decoration: none;
}

.session-card__title a:hover {
  color: var(--color-action-primary-hover);
  text-decoration: underline;
}

.session-card__title a:focus-visible {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 3px;
  border-radius: 2px;
}

.session-card__abstract {
  color: var(--color-text-secondary);
}
</style>
