<script setup lang="ts">
import { onMounted } from 'vue'
import { useConferenceData } from './composables/useConferenceData'

const { sessions, conferenceName, isLoading, loadData } = useConferenceData()

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
      <h1>GameFoundry</h1>
      <p class="tagline">Forge Your Schedule</p>
    </header>

    <main class="app-content">
      <section class="card">
        <h2>System Status</h2>

        <div v-if="isLoading">Lade Konferenzdaten...</div>
        <div v-else class="success-message">
          <strong>{{ conferenceName }}</strong> erfolgreich geladen.<br />
          Anzahl der verfügbaren Sessions: <strong>{{ sessions.length }}</strong>
        </div>

        <button class="primary-btn">Zum Programm hinzufügen (TODO)</button>
      </section>
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  padding: var(--space-32);
  display: flex;
  flex-direction: column;
  gap: var(--space-32);
}

.app-header h1 {
  color: var(--color-action-primary);
  margin: 0;
}

.tagline {
  color: var(--color-accent);
  margin-top: var(--space-4);
}

.card {
  background-color: var(--color-surface-card);
  padding: var(--space-24);
  border-radius: 8px;
  max-width: 600px;
}

.primary-btn {
  margin-top: var(--space-16);
  background-color: var(--color-action-primary);
  color: var(--color-text-inverse);
  border: none;
  padding: var(--space-8) var(--space-16);
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
}

.success-message {
  border-left: 4px solid var(--color-action-primary);
  padding-left: var(--space-8);
  margin: var(--space-16) 0;
}
</style>
