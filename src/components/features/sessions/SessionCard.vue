<script setup lang="ts">
import type { ConferenceSession } from '@/composables/useConferenceData'
import BaseCard from '../../base/BaseCard.vue'

defineProps<{
	session: ConferenceSession
	trackName: string
}>()
</script>

<template>
	<BaseCard class="session-card">
		<template #header>
			<p class="session-card__meta">
				{{ session.day }} · {{ session.startTime }}–{{ session.endTime }}
				· {{ trackName }} · {{ session.level }}
			</p>
			<h3 class="session-card__title">{{ session.title }}</h3>
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

.session-card__abstract {
	color: var(--color-text-secondary);
}
</style>
