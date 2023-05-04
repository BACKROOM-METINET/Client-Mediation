import { defineStore } from 'pinia'
import { ref, computed, type Ref, type ComputedRef } from 'vue'
import type { Room } from '@/client/types/business'

export const useRoomStore = defineStore('room', () => {
	// State

	const roomsRef: Ref<Room[]> = ref([])

	const currentRoomId = ref<string | null>(null)

	// Getters

	const rooms = computed(() =>
		roomsRef.value.map((room) => {
			return {
				...room,
			}
		})
	)

	const currentRoom: ComputedRef<Room | undefined> = computed(() => {
		return roomsRef.value.find((room) => room.id === currentRoomId.value)
	})

	return {
		rooms,
		currentRoom,
		setRooms,
		upsertRoom,
		setCurrentRoomId,
	}

	// Actions

	function setRooms(rooms: Room[]) {
		roomsRef.value = rooms
	}

	function upsertRoom(room: Room) {
		const roomIndex = roomsRef.value.findIndex((_room) => _room.id === room.id)

		if (roomIndex !== -1) {
			roomsRef.value[roomIndex] = { ...room }
		} else {
			roomsRef.value.push({ ...room })
		}
	}

	function setCurrentRoomId(roomId: string | null) {
		currentRoomId.value = roomId
	}
})
