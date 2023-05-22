<script setup lang="ts">
import { ref } from 'vue'

const emits = defineEmits<{
	(event: 'login', username: string): void
}>()

const username = ref('')

async function login(username: string) {
	if (!username) {
		return alert('please provide a username')
	}
	emits('login', username)
}
</script>

<template>
	<div class="visio-base">
		<div class="username-form">
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

<style scoped src="./PreVisio.scss"></style>
