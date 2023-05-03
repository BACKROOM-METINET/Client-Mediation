<script setup lang="ts">
import { toRefs, watch } from 'vue'
import { RouterView } from 'vue-router'
import { useHighLevelClientEmits } from '@/composables/emits'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const { user } = toRefs(authStore)

const clientEmits = useHighLevelClientEmits()

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
