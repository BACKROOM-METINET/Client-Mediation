<script setup lang="ts">
// import components
import { ref, toRefs } from 'vue'
import { useAuthStore } from '@/stores/auth'
import Logs from '../Log/Log.vue'
import Rooms from '../Rooms/Rooms.vue'
import VideoVisio from '../Video/Video.vue'

const authStore = useAuthStore()

const { user } = toRefs(authStore)

const username = ''
const logsIsHidden = ref(false)

async function login(username: string) {
	if (!username) {
		return alert('please provide a username')
	}

	await authStore.login(username)
}
</script>

<template>
	<div class="visio-base">
		<div class="meeting-page" v-if="user">
			<Rooms />
			<VideoVisio :username="username" />
			<Logs v-if="!logsIsHidden" />
			<button
				class="button-hide-logs btn btn-primary"
				@click="logsIsHidden = !logsIsHidden">
				Hide logs
			</button>
		</div>
		<div class="username-form" v-else>
			<form class="form-inline" @submit.prevent="login(username)">
				<div class="form-floating mb-2">
					<input
						type="text"
						class="form-control username-input"
						v-model="username"
						id="username"
						placeholder="Username" />
					<label class="username-label" for="floatingInput">Username</label>
				</div>
				<button type="submit" class="btn btn-primary mb-2">Submit</button>
			</form>
		</div>
	</div>
</template>

<style scoped src="./Visio.scss"></style>
