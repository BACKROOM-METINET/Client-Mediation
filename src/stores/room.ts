import { defineStore } from 'pinia'
import { ref, computed, type Ref, type ComputedRef, toRefs } from 'vue'
import type {
	AvatarEventInput,
	Participant,
	ParticipantEvent,
	Room,
	User,
} from '@/client/types/business'
import { recordToLength } from '@/client/utils/converter'
import { useAuthStore } from './auth'

export const useRoomStore = defineStore('room', () => {
	// Stores
	const authStore = useAuthStore()
	const { user } = toRefs(authStore)

	// State

	const roomsRef: Ref<Room[]> = ref([])

	const currentRoomId = ref<number | null>(null)

	// Getters

	const currentUser: ComputedRef<User | null> = computed(() => user.value)

	const currentParticipant: ComputedRef<Participant | null> = computed(() => {
		const room = roomsRef.value.find(
			(_room) => _room.id === currentRoomId.value
		)
		if (!room || !user.value) return null
		return room.participants.find((_p) => _p.name === user.value?.name) ?? null
	})

	const rooms: ComputedRef<Room[]> = computed(() =>
		roomsRef.value.map((room) => {
			return {
				...room,
			}
		})
	)

	const currentRoom: ComputedRef<Room | null> = computed(() => {
		const room = roomsRef.value.find(
			(_room) => _room.id === currentRoomId.value
		)
		if (!room) return null
		return {
			...room,
		}
	})

	return {
		currentUser,
		currentParticipant,
		rooms,
		currentRoom,
		setRooms,
		upsertRoom,
		setCurrentRoomId,
		removeRoom,
		addParticipant,
		removeParticipant,
		upsertParticipant,
	}

	// Actions

	function setRooms(rooms: Room[]) {
		roomsRef.value = rooms
	}

	function upsertRoom(room: Room) {
		const index = roomsRef.value.findIndex((_room) => _room.id === room.id)

		if (index !== -1) {
			roomsRef.value[index] = { ...room }
			if (recordToLength(roomsRef.value[index].participants) === 0)
				removeRoom(roomsRef.value[index].id)
		} else {
			roomsRef.value.push({ ...room })
		}
	}

	function setCurrentRoomId(roomId: number | null) {
		currentRoomId.value = roomId
	}

	function removeRoom(roomId: number) {
		const index = roomsRef.value.findIndex((_room) => _room.id === roomId)
		if (index !== -1) {
			roomsRef.value.splice(index, 1)
		}
	}

	function addParticipant(roomId: number, participant: ParticipantEvent) {
		const index = roomsRef.value.findIndex((_room) => _room.id === roomId)

		if (index !== -1) {
			const participantIndex = roomsRef.value[index].participants.findIndex(
				(_p) => _p.name === participant.name
			)
			if (participantIndex !== -1)
				roomsRef.value[index].participants[participantIndex] = {
					...participant,
					isMe: participant.name === user.value?.name,
				}
		}
	}

	function removeParticipant(roomId: number, username: string) {
		const index = roomsRef.value.findIndex((_room) => _room.id === roomId)

		if (index !== -1) {
			const participantIndex = roomsRef.value[index].participants.findIndex(
				(_p) => _p.name === username
			)
			if (participantIndex !== -1)
				roomsRef.value[index].participants.splice(participantIndex, 1)
		}
	}

	function upsertParticipant(
		roomId: number,
		username: string,
		data: AvatarEventInput
	) {
		const index = roomsRef.value.findIndex((_room) => _room.id === roomId)
		if (index !== -1) {
			const participant = roomsRef.value[index].participants.find(
				(_p) => _p.name === username
			)
			if (!participant) return
			participant.emotion = data.emotion
			participant.avatar = data
		}
	}
})
