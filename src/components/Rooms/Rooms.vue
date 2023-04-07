<script setup lang="ts">
import { ref } from 'vue'
import { emitter } from '@/client/events/event'
import AddRoom from '../AddRoom/AddRoom.vue'

const rooms = ref([
	{ id: 1, name: 'Test1' },
	{ id: 2, name: 'Test2' },
	{ id: 3, name: 'Test3' },
	{ id: 4, name: 'Test4' },
	{ id: 5, name: 'Test5' },
])

const roomCount = ref(0)

created()

function created() {
	emitter.on('new_room', (data: any) => {
		roomCount.value++
		rooms.value.push({ id: roomCount.value, name: data })
	})
}

function showRoom(room: string) {
	emitter.emit('show_room', room)
}
</script>

<template>
	<div class="col-md-3 room-area">
		<div class="rooms">
			<div
				class="room"
				v-for="room in rooms"
				v-bind:key="room.id"
				@click="showRoom(room.name)">
				{{ room.name }}
			</div>
		</div>
		<AddRoom />
		<!-- Imported AddRoom component -->
	</div>
</template>

<style scoped src="./Rooms.scss"></style>
