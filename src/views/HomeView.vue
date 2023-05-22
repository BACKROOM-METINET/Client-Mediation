<script setup lang="ts">
import { toRefs } from 'vue'
import PreVisio from '@/components/PreVisio/PreVisio.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const { isConnected } = toRefs(authStore)

async function login(username: string) {
	if (!username) return
	await authStore.login(username)
}
</script>

<template>
	<main>
		<PreVisio v-if="!isConnected" @login="login" />
		<RouterView v-else />
	</main>
</template>
