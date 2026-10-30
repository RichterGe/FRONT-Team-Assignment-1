<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { usePersonalProgramme } from '@/composables/usePersonalProgramme'

const { mySessions, isLoading, loadData, removeSession } = usePersonalProgramme()

onMounted(async () => {
  // Ensure base conference data is fetched
  await loadData()
})
</script>

<template>
  <main class="my-programme-view">
    <header class="dashboard-header card">
      <h1>My Programme</h1>
      <p class="subtitle">Your bookmarked sessions</p>
    </header>

    <!-- State 1: CSR Hydration / Loading -->
    <div v-if="isLoading" class="card state-loading">
      <p>Loading your programme...</p>
    </div>

    <!-- State 2: Empty State -->
    <div v-else-if="mySessions.length === 0" class="card state-empty">
      <h2>Your timetable is still empty</h2>
      <p>You have not added any sessions to your personal programme yet.</p>
      <RouterLink :to="{ name: 'conference-overview' }" class="button-primary btn-browse">
        Forge Your Schedule
      </RouterLink>
    </div>

    <!-- State 3: Populated Session List -->
    <div v-else class="session-list">
      <article v-for="session in mySessions" :key="session.id" class="card session-card">
        <div class="session-meta">
          <span class="badge day-badge">Day {{ session.day }}</span>
          <span class="time">{{ session.startTime }} – {{ session.endTime }}</span>
          <span class="badge level-badge">{{ session.level }}</span>
        </div>

        <h3 class="session-title">
          <RouterLink :to="{ name: 'session-detail', params: { id: session.id } }">
            {{ session.title }}
          </RouterLink>
        </h3>

        <p class="session-abstract">{{ session.abstract }}</p>

        <div class="session-actions">
          <button
            type="button"
            class="btn-remove"
            aria-label="Remove from personal programme"
            @click="removeSession(session.id)"
          >
            Remove from Programme
          </button>
        </div>
      </article>
    </div>
  </main>
</template>

<style scoped>
.my-programme-view {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
}

.dashboard-header h1 {
  color: var(--color-action-primary);
  margin: 0;
}

.subtitle {
  color: var(--color-text-secondary);
  margin-top: var(--space-4);
}

.state-loading,
.state-empty {
  text-align: center;
  padding: var(--space-32) var(--space-16);
}

.state-empty h2 {
  color: var(--color-text-primary);
  margin-bottom: var(--space-8);
}

.state-empty p {
  color: var(--color-text-muted);
  margin-bottom: var(--space-16);
}

.btn-browse {
  display: inline-block;
  text-decoration: none;
}

.session-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
}

.session-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.session-meta {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.badge {
  padding: 2px 6px;
  border-radius: 4px;
  background-color: var(--color-surface-alt);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  font-size: 0.75rem;
}

.session-title {
  margin: 0;
  font-size: 1.25rem;
}

.session-title a {
  color: var(--color-action-primary);
  text-decoration: none;
}

.session-title a:hover {
  text-decoration: underline;
}

.session-abstract {
  font-size: 0.95rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
}

.session-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: var(--space-8);
}

.btn-remove {
  background: transparent;
  color: var(--color-accent-warm);
  border: 1px solid var(--color-accent-warm);
  padding: var(--space-4) 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-remove:hover {
  background: var(--color-accent-warm);
  color: var(--color-bg);
}
</style>
