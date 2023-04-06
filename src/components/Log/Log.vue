<script setup lang="ts">
import { ref } from 'vue'
import { emitter } from '@/client/events/event'

const logs = ref([])
const logCount = ref(0)

created()

function created() {
	emitter.on('new_log', (message: any) => {
		logs.value.push({ id: logCount.value, message: message })
		logCount.value += 1
	})
}
</script>

<template>
	<div class="col-md-3 log-area">
		<div class="log" v-for="log in logs" v-bind:key="log.id">
			{{ log.message }}
		</div>
	</div>
</template>

<style scoped src="./Log.scss"></style>