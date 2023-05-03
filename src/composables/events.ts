import type {
	AvatarDataEvent,
	ParticipantAddedEvent,
	ParticipantRemovedEvent,
	RoomCreatedEvent,
	RoomDeletedEvent,
} from '@/client/types/events'
import { useLowLevelClient } from '@/client/useLowLevelClient'
import { useRoomStore } from '@/stores/room'

export function listenHighLevelClientEvents() {
	const client = useLowLevelClient()

	const roomStore = useRoomStore()

	client.on<RoomCreatedEvent>('@RoomCreated', async ({ room }) => {
		roomStore.upsertRoom(room)
	})

	client.on<RoomDeletedEvent>('@RoomDeleted', async ({ roomId }) => {
		roomStore.removeRoom(roomId)
	})

	client.on<ParticipantAddedEvent>(
		'@ParticipantAdded',
		async ({ roomId, participant }) => {
			roomStore.addParticipant(roomId, participant)
		}
	)

	client.on<ParticipantRemovedEvent>(
		'@ParticipantRemoved',
		async ({ roomId, username }) => {
			roomStore.removeParticipant(roomId, username)
		}
	)

	client.on<AvatarDataEvent>(
		'@AvatarData',
		async ({ roomId, username, data }) => {
			roomStore.upsertParticipant(roomId, username, data)
		}
	)
}
