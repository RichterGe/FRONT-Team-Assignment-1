<script setup lang="ts">
import type { ConferenceSession } from '@/composables/useConferenceData'
import BaseCard from '../../base/BaseCard.vue'
import { RouterLink } from 'vue-router'

defineProps<{
  session: ConferenceSession
  trackName: string
  isBookmarked: boolean
}>()

const emit = defineEmits<{
  toggleBookmark: [sessionId: string]
}>()
</script>

<template>
  <BaseCard class="session-card">
    <template #header>
      <p class="session-card__meta">
        {{ session.day }} · {{ session.startTime }}–{{ session.endTime }} · {{ trackName }} ·
        {{ session.level }}
      </p>
      <div class="session-card__title-row">
        <h3 class="session-card__title">
          <RouterLink :to="{ name: 'session-detail', params: { id: session.id } }">
            {{ session.title }}
          </RouterLink>
        </h3>
        <button
          type="button"
          class="btn-bookmark"
          :class="{ 'is-bookmarked': isBookmarked }"
          :aria-pressed="isBookmarked"
          :aria-label="isBookmarked ? 'Remove from My Programme' : 'Add to My Programme'"
          @click="emit('toggleBookmark', session.id)"
        >
          {{ isBookmarked ? '★' : '☆' }}
        </button>
      </div>
    </template>
    <p class="session-card__abstract">{{ session.abstract }}</p>
  </BaseCard>
</template>

<style scoped>
.session-card__meta {
  color: var(--color-text-muted);
  font-size: var(--text-metadata);
}

.session-card__title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-8);
  margin-top: var(--space-8);
}

.session-card__title {
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

.btn-bookmark {
  background: transparent;
  color: var(--color-action-primary);
  border: 1px solid var(--color-border);
  width: 2rem;
  height: 2rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.1rem;
  line-height: 1;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.btn-bookmark:hover {
  border-color: var(--color-action-primary);
  background: var(--color-surface);
}

.btn-bookmark.is-bookmarked {
  background: var(--color-action-primary);
  border-color: var(--color-action-primary);
  color: var(--color-action-primary-text);
}
</style>
