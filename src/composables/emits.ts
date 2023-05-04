import type {
	CreateRoomEmit,
	GetRoomsEmit,
	JoinRoomEmit,
	LeaveRoomEmit,
	SendAvatarDataEmit,
	StartMediationEmit,
} from '@/client/types/emits'
import { useLowLevelClient } from '@/client/useLowLevelClient'
import { useRoomStore } from '@/stores/room'
import type { AvatarEventInput, RoomConfig } from '../client/types/business'

export function useHighLevelClientEmits() {
	const client = useLowLevelClient()

	const roomStore = useRoomStore()

	return {
		async getRooms() {
			const { rooms } = await client.emit<GetRoomsEmit>('@getRooms', {})
			roomStore.setRooms(rooms)
		},

		async createRoom(username: string, roomName: string) {
			const response = await client.emit<CreateRoomEmit>('@createRoom', {
				username: username,
				roomName: roomName,
			})

			const { room } = response
			roomStore.setCurrentRoomId(room.id)
			roomStore.upsertRoom(room)

			return response
		},

		async joinRoom(username: string, roomId: number) {
			const response = await client.emit<JoinRoomEmit>('@joinRoom', {
				username: username,
				roomId: roomId,
			})

			const { room } = response
			roomStore.setCurrentRoomId(room.id)
			roomStore.upsertRoom(room)
			return response
		},

		async leaveRoom(username: string, roomId: number) {
			const response = await client.emit<LeaveRoomEmit>('@leaveRoom', {
				username: username,
				roomId: roomId,
			})

			const { room } = response
			roomStore.setCurrentRoomId(null)
			roomStore.upsertRoom(room)
			return response
		},

		async sendAvatarData(
			username: string,
			roomId: number,
			avatar: AvatarEventInput
		) {
			const response = await client.emit<SendAvatarDataEmit>(
				'@sendAvatarData',
				{
					username,
					roomId,
					avatar,
				}
			)

			const { room } = response
			roomStore.setCurrentRoomId(null)
			roomStore.upsertRoom(room)
			return response
		},

		async startMediation(username: string, roomId: number, config: RoomConfig) {
			const response = await client.emit<StartMediationEmit>(
				'@startMediation',
				{
					username,
					roomId,
					config,
				}
			)

			const { room } = response
			roomStore.upsertRoom(room)
			return response
		},
	}
}
