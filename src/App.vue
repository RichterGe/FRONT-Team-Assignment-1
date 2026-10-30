<script setup lang="ts">
import { ref } from 'vue'
import { RouterView, RouterLink } from 'vue-router'
import { usePersonalProgramme } from '@/composables/usePersonalProgramme'

// Theme Button logic - temporary placement until the next step
const currentTheme = ref('dark')
const toggleTheme = () => {
  currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
}

const { savedSessionIds } = usePersonalProgramme()
</script>

<template>
  <div class="app-shell" :data-theme="currentTheme">
    <header class="app-header">
      <div class="brand-bar">
        <RouterLink to="/" class="brand-link">
          <h1>GameFoundry</h1>
        </RouterLink>
        <nav class="nav-links">
          <RouterLink to="/" class="nav-link">Overview</RouterLink>
          <RouterLink to="/my-programme" class="nav-link">
            My Programme
            <span v-if="savedSessionIds.length > 0" class="counter-badge">
              {{ savedSessionIds.length }}
            </span>
          </RouterLink>
        </nav>
      </div>
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
.brand-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-16);
}

.brand-link {
  text-decoration: none;
  color: inherit;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: var(--space-16);
}

.nav-link {
  color: var(--color-text-secondary);
  text-decoration: none;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: var(--space-8);
  padding: var(--space-4) var(--space-8);
  border-radius: 4px;
  transition: color 0.2s ease;
}

.nav-link:hover{
  color: var(--color-action-primary);
}

.counter-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-action-primary);
  color: var(--color-action-primary-text);
  font-size: var(--text-metadata, 0.75rem);
  font-weight: bold;
  min-width: 1.25rem;
  height: 1.25rem;
  padding: 0 0.35rem;
  border-radius: 9999px;
  line-height: 1;
}
</style>
