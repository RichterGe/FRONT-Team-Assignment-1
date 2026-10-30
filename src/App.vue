<script setup lang="ts">
import { ref } from 'vue'
import { RouterView, RouterLink } from 'vue-router'

// Theme Button logic - temporary placement until the next step
const currentTheme = ref('dark')
const toggleTheme = () => {
  currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
}
</script>

<template>
  <div class="app-shell" :data-theme="currentTheme">
    <header class="app-header">
      <RouterLink to="/" class="brand-link">
        <h1>GameFoundry</h1>
      </RouterLink>
      <p class="hero-title">Forge Your Schedule</p>
    </header>

    <main class="app-content">
      <RouterView />
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

<style scoped>
.brand-link {
  text-decoration: none;
  color: inherit;
}
</style>
