<script setup lang="ts">
import { ref } from 'vue'
import { useHighLevelClientEmits } from '@/composables/emits'

const clientEmits = useHighLevelClientEmits()

const roomName = ref('')

async function createNewRoom() {
	if (!roomName.value) {
		alert('please provide a room name')
		return
	}

	await clientEmits.createRoom(roomName.value)
	roomName.value = ''
}
</script>

<template>
	<div class="roomForm">
		<form
			class="form-inline room-form"
			@submit.prevent="createNewRoom()">
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
