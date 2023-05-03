import { useLowLevelClient } from '@/client/useLowLevelClient'
import { useRoomStore } from '@/stores/room'

export function listenHighLevelClientEvents() {
	const client = useLowLevelClient()

	const roomStore = useRoomStore()

	client.on<any>('@RoomCreated', async ({ room }) => {
		roomStore.upsertRoom(room)
	})

	client.on<any>('@RoomDeleted', async ({ roomId }) => {
		roomStore.removeRoom(roomId)
	})

	client.on<any>('@ParticipantAdded', async ({ roomId, participant }) => {
		roomStore.addParticipant(roomId, participant)
	})

	client.on<any>('@ParticipantRemoved', async ({ roomId, username }) => {
		roomStore.removeParticipant(roomId, username)
	})

	client.on<any>('@AvatarData', async ({ roomId, username, data }) => {
		roomStore.upsertParticipant(roomId, username, data)
	})
}
