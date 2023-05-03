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

function joinRoom(room: Room) {
  if (currentRoom.value) {
    clientEmits.leaveRoom(user.value.username, currentRoom.value.id)
  }
	clientEmits.joinRoom(user.value.username, room.id)
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
				<p>{{ room.name }}</p>
				<br />
				<p>{{ room.participants.length }}</p>
			</div>
		</div>
		<AddRoom />
	</div>
</template>

<style scoped src="./Rooms.scss"></style>
