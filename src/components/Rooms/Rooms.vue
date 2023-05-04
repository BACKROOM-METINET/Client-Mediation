<script setup lang="ts">
import { toRefs } from 'vue'
import { emitter } from '@/client/events/event'
import type { Room } from '@/client/types/business'
import { useHighLevelClientEmits } from '@/composables/emits'
import { useAuthStore } from '@/stores/auth'
import { useRoomStore } from '@/stores/room'
import AddRoom from '../AddRoom/AddRoom.vue'

const clientEmits = useHighLevelClientEmits()

const roomStore = useRoomStore()
const authSore = useAuthStore()

const { rooms, currentRoom } = toRefs(roomStore)
const { user } = toRefs(authSore)

async function joinRoom(room: Room) {
	if (currentRoom.value) {
		await clientEmits.leaveRoom(user.value.name, currentRoom.value.id)
	}
	await clientEmits.joinRoom(user.value.name, room.id)
	emitter.emit('show_room', room.name)
}
</script>

<template>
	<div class="col-md-3 room-area">
		<div class="rooms">
			<div
				class="room"
				v-for="room in rooms"
				v-bind:key="room.id"
				@click="joinRoom(room)">
				<div class="d-flex justify-content-between">
					<p class="mb-0">
						<strong>{{ room.name }}</strong>
					</p>
					<p class="mb-0">{{ room.participants.length }} connected</p>
				</div>
			</div>
		</div>
		<AddRoom />
	</div>
</template>

<style scoped src="./Rooms.scss"></style>
