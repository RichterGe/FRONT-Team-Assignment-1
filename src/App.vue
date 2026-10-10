<script setup lang="ts">
import { ref } from 'vue'
import { onMounted } from 'vue'
import { useConferenceData } from './composables/useConferenceData'

const { sessions, conferenceName, isLoading, error, loadData } = useConferenceData()

onMounted(() => {
  loadData()
})


//Theme Button logic - temporary placement until the next step
const currentTheme = ref('dark')
const toggleTheme = () => {
  currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
}

</script>

<template>
  <div class="app-shell" :data-theme="currentTheme">
    <header class="app-header">
      <h1>GameFoundry</h1>
      <p class="hero-title">Forge Your Schedule</p>
    </header>

    <main class="app-content">
      <section class="card">
        <h2>System Status</h2>

        <div v-if="isLoading">Lade Konferenzdaten...</div>
        <div v-else-if="error" class="error-message">
          <strong>{{ conferenceName }}</strong> konnte nicht geladen werden.
        </div>
        <div v-else class="success-message">
          <strong>{{ conferenceName }}</strong> erfolgreich geladen.<br />
          Anzahl der verfügbaren Sessions: <strong>{{ sessions.length }}</strong>
        </div>


        <button class="button-primary">Zum Programm hinzufügen (TODO)</button>
      </section>
    </main>

    <button
      @click="toggleTheme"
      class="button-primary"
      :aria-pressed="currentTheme === 'dark'"
    >
      Switch to {{ currentTheme === 'light' ? 'dark' : 'light' }} Mode
    </button>

  </div>
</template>

