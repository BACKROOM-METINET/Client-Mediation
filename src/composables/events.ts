import { useRouter } from 'vue-router'
import type {
	AvatarDataEvent,
	MediationStartedEvent,
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
	const router = useRouter()

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

	client.on<MediationStartedEvent>(
		'@MediationStarted',
		async ({ room, mediator }) => {
			console.log(`Mediation start by ${mediator} in room "${room.name}"`)
			roomStore.upsertRoom(room)
			router.push({ name: 'mediation' })
		}
	)
}
