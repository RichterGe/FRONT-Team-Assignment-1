<script setup lang="ts">
import type { ConferenceTrack } from '@/composables/useConferenceData'

defineProps<{
  tracks: ConferenceTrack[]
  days: string[]
  levels: string[]
  selectedTrack: string | null
  selectedDay: string | null
  selectedLevel: string | null
}>()

const emit = defineEmits<{
  'update:selectedTrack': [value: string | null]
  'update:selectedDay': [value: string | null]
  'update:selectedLevel': [value: string | null]
  clear: []
}>()

function selectedValue(event: Event): string | null {
  const value = (event.currentTarget as HTMLSelectElement).value
  return value || null
}

function updateTrack(event: Event) {
  emit('update:selectedTrack', selectedValue(event))
}

function updateDay(event: Event) {
  emit('update:selectedDay', selectedValue(event))
}

function updateLevel(event: Event) {
  emit('update:selectedLevel', selectedValue(event))
}
</script>

<template>
  <form class="filters" aria-label="Filter sessions" @submit.prevent>
    <label class="filters__field">
      <span>Track</span>
      <select :value="selectedTrack" @change="updateTrack">
        <option value="">All tracks</option>
        <option v-for="track in tracks" :key="track.id" :value="track.id">
          {{ track.name }}
        </option>
      </select>
    </label>

    <label class="filters__field">
      <span>Conference day</span>
      <select :value="selectedDay" @change="updateDay">
        <option value="">All days</option>
        <option v-for="day in days" :key="day" :value="day">{{ day }}</option>
      </select>
    </label>

    <label class="filters__field">
      <span>Level</span>
      <select :value="selectedLevel" @change="updateLevel">
        <option value="">All levels</option>
        <option v-for="level in levels" :key="level" :value="level">{{ level }}</option>
      </select>
    </label>

    <button class="filters__clear" type="button" @click="emit('clear')">Clear filters</button>
  </form>
</template>

<style scoped>
.filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 180px), 1fr));
  align-items: end;
  gap: var(--space-16);
  margin-bottom: var(--space-16);
  padding: var(--space-16);
  border: 1px solid var(--color-border);
  background: var(--color-surface-alt);
}

.filters__field {
  display: grid;
  gap: var(--space-8);
  color: var(--color-text-secondary);
  font-size: var(--text-label);
}

.filters__field select,
.filters__clear {
  min-height: 44px;
  padding: var(--space-8);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-surface);
  color: var(--color-text-primary);
  font: inherit;
}

.filters__field select:focus-visible,
.filters__clear:focus-visible {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 2px;
}

.filters__clear {
  cursor: pointer;
}

.filters__clear:hover {
  border-color: var(--color-accent-warm);
}
</style>
