<script setup lang="ts">
import { ref, toRefs } from 'vue'
import { emitter } from '@/client/events/event'
import { useHighLevelClientEmits } from '@/composables/emits'
import { useAuthStore } from '@/stores/auth'
import { useRoomStore } from '@/stores/room'

const clientEmits = useHighLevelClientEmits()

const roomName = ref('')

const roomStore = useRoomStore()
const authSore = useAuthStore()

const { currentRoom } = toRefs(roomStore)
const { user } = toRefs(authSore)

async function createNewRoom() {
	if (!roomName.value) {
		alert('please provide a room name')
		return
	}
	if (!user.value) return
	if (currentRoom.value) {
		await clientEmits.leaveRoom(user.value.name, currentRoom.value.id)
	}
	await clientEmits.createRoom(user.value.name, roomName.value)
	emitter.emit('show_room', roomName.value)
	roomName.value = ''
}
</script>

<template>
	<div class="roomForm">
		<form class="form-inline room-form" @submit.prevent="createNewRoom()">
			<div class="form-floating mb-2">
				<input
					type="text"
					class="form-control room-input"
					id="room-name"
					v-model="roomName"
					placeholder="room name" />
				<label class="room-label" for="room-name">Room name</label>
			</div>
			<button type="submit" class="btn btn-primary mb-2">Create Room</button>
		</form>
	</div>
</template>

<style scoped src="./VisioAddRoom.scss"></style>
