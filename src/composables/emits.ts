import type {
	createAndJoinRoomEmit,
	GetRoomsEmit,
	joinRoomEmit,
	leaveRoomEmit,
} from '@/client/types/emits'
import { useLowLevelClient } from '@/client/useLowLevelClient'
import { useRoomStore } from '@/stores/room'

export function useHighLevelClientEmits() {
	const client = useLowLevelClient()

	const roomStore = useRoomStore()

	return {
		async getRooms() {
			const { rooms } = await client.emit<GetRoomsEmit>('@getRooms', {})
			roomStore.setRooms(rooms)
		},

		async createAndJoinRoom(username: string, roomName: string) {
			const response = await client.emit<createAndJoinRoomEmit>(
				'@createAndJoinRoom',
				{
					username: username,
					roomName: roomName,
				}
			)

			const { room } = response
			roomStore.upsertRoom(room)

			return response
		},

		async joinRoom(username: string, roomId: string) {
			const response = await client.emit<joinRoomEmit>('@joinRoom', {
				username: username,
				roomId: roomId,
			})

			const { room } = response
			roomStore.setCurrentRoomId(room.id)
			roomStore.upsertRoom(room)
			return response
		},

		async leaveRoom(username: string, roomId: string) {
			const response = await client.emit<leaveRoomEmit>('@leaveRoom', {
				username: username,
				roomId: roomId,
			})

			const { room } = response
			roomStore.setCurrentRoomId(null)
			roomStore.upsertRoom(room)
			return response
		},
	}
}
