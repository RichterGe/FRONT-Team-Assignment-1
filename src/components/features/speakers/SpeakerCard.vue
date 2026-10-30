<script setup lang="ts">
import BaseCard from '@/components/base/BaseCard.vue'
import type { ConferenceSpeaker } from '@/composables/useConferenceData'

const props = defineProps<{
  speaker: ConferenceSpeaker
}>()
</script>

<template>
  <BaseCard class="speaker-card">
    <template #header>
      <h1 class="speaker-card__name">{{ props.speaker.name }}</h1>
    </template>

    <div class="speaker-card__content">
      <p class="speaker-card__role">{{ props.speaker.title }}</p>
      <p class="speaker-card__company">{{ props.speaker.company }}</p>
      <p class="speaker-card__bio">{{ props.speaker.bio }}</p>
    </div>
  </BaseCard>
</template>

<style scoped>
.speaker-card__name {
  color: var(--color-hero-highlight);
  font-size: var(--text-heading-page);
}

.speaker-card__content {
  display: grid;
  gap: var(--space-8);
}

.speaker-card__role {
  color: var(--color-text-primary);
  font-size: var(--text-heading-small);
}

.speaker-card__company,
.speaker-card__bio {
  color: var(--color-text-secondary);
}

.speaker-card__bio {
  margin-top: var(--space-8);
  line-height: 1.6;
}
</style>
