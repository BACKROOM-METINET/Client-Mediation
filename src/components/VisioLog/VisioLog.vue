<script setup lang="ts">
import { ref } from 'vue'
import { emitter } from '@/client/events/event'
import type { VisioLog } from '@/client/types/business'

const logs = ref<VisioLog[]>([])
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

<style scoped src="./VisioLog.scss"></style>
