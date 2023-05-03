import { ref } from 'vue'
import Client from './client'

const authenticating = ref(false)

export const client = new Client()

export function useLowLevelClient() {
	async function connect(username: string): Promise<any> {
		authenticating.value = true

		client.reinitializeConnection()

		try {
			const auth = await client.authenticate(username)
			authenticating.value = false
			return auth
		} catch (e) {
			authenticating.value = false
			throw e
		}
	}

	return {
		connect,
		emit: client.emit.bind(client),
		on: client.on.bind(client),
		authenticating,
	}
}
