import { defineStore } from 'pinia'
import { computed, ref, type Ref } from 'vue'
import type { User } from '@/client/types/business'
import { useLowLevelClient } from '@/client/useLowLevelClient'

const { connect } = useLowLevelClient()

export const useAuthStore = defineStore('auth', () => {
	const user: Ref<User | null> = ref(null)
	const connectionState: Ref<boolean> = ref(false)

	const isConnected = computed(() => connectionState.value)

	async function login(username = 'defaultUsername') {
		try {
			const obj = await connect(username)
			connectionState.value = true
			user.value = obj.user
		} catch (e) {
			connectionState.value = false
			user.value = null
			throw e
		}
	}

	return {
		isConnected,
		user,
		login,
	}
})
