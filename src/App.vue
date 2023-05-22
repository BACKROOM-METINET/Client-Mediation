<script setup lang="ts">
import { toRefs, watch } from 'vue'
import { RouterView } from 'vue-router'
import { useHighLevelClientEmits } from '@/composables/emits'
import { useAuthStore } from '@/stores/auth'
import { listenHighLevelClientEvents } from './composables/events'

const authStore = useAuthStore()

const { user } = toRefs(authStore)

const clientEmits = useHighLevelClientEmits()

listenHighLevelClientEvents()

watch(user, (newUser, oldUser) => {
	const justAuthenticated = newUser && !oldUser
	if (justAuthenticated) {
		clientEmits.getRooms()
	}
})
</script>

<template>
	<RouterView />
</template>
