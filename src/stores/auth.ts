import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useLowLevelClient } from '@/client/useLowLevelClient'

const { connect } = useLowLevelClient()

export const useAuthStore = defineStore('auth', () => {
	const user = ref<any | null>(null)

	async function login(username = 'defaultUsername') {
		try {
			user.value = await connect(username)
		} catch (e) {
			user.value = null
			throw e
		}
	}

	return {
		user,
		login,
	}
})
