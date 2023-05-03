import { useLowLevelClient } from '@/client/useLowLevelClient'
import { useRoomStore } from '@/stores/room'

export function listenHighLevelClientEvents() {
	const client = useLowLevelClient()

	const roomStore = useRoomStore()

	client.on<any>('@roomCreated', async ({ room }) => {
		roomStore.upsertRoom(room)
	})
}
