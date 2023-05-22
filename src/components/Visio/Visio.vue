<script setup lang="ts">
// import components
import { ref, toRefs } from 'vue'
import { useAuthStore } from '@/stores/auth'
import Logs from '../VisioLog/VisioLog.vue'
import Rooms from '../VisioRooms/VisioRooms.vue'
import VideoVisio from '../VisioVideo/VisioVideo.vue'

const authStore = useAuthStore()

const { user } = toRefs(authStore)

const logsIsHidden = ref(false)
</script>

<template>
	<div class="visio-base">
		<div class="meeting-page" v-if="user">
			<Rooms />
			<VideoVisio :username="user.name" />
			<Logs v-if="!logsIsHidden" />
			<button
				class="button-hide-logs btn btn-primary"
				@click="logsIsHidden = !logsIsHidden">
				Hide logs
			</button>
		</div>
	</div>
</template>

<style scoped src="./Visio.scss"></style>
