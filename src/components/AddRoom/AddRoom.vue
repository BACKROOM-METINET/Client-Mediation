<script setup lang="ts">
import { ref } from 'vue'
import { emitter } from '@/client/events/event'

const roomName = ref('')

function createNewRoom(name: string) {
	if (!name) {
		alert('please provide a room name')
		return
	}

	roomName.value = ''
	emitter.emit('new_room', name)
}
</script>

<template>
	<div class="roomForm">
		<form
			class="form-inline room-form"
			@submit.prevent="createNewRoom(roomName)">
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

<style scoped src="./AddRoom.scss"></style>