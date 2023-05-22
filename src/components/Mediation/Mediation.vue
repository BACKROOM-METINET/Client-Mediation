<script setup lang="ts">
import '@babylonjs/core/Debug/debugLayer'

import '@babylonjs/loaders/glTF'
import 'babylonjs-loaders'
import '@babylonjs/loaders/OBJ/objFileLoader'

import { onMounted, ref, toRefs } from 'vue'
import type { MediationConfig } from '@/client/types/config'
import type { MeshRoomEnum, SkyboxEnum } from '@/client/types/meshes'
import MediationOptions from '@/components/MediationOptions/MediationOptions.vue'
import MediationUI from '@/components/MediationUI/MediationUI.vue'
import { useMediationStore } from '@/stores/mediation'
import { useSettingStore } from '@/stores/setting'

const settingStore = useSettingStore()
const {
	isHolisticActivatedRef,
	holisticComplexityRef,
	sceneRoomRef,
	sceneSkyboxRef,
	isCameraPreviewRef,
} = toRefs(settingStore)
const mediationStore = useMediationStore()
const { isHolisticLoading, emotionRef } = toRefs(mediationStore)
const isConfigMenuOpen = ref(false)

function openConfigMenu() {
	isConfigMenuOpen.value = true
}

function closeConfigMenu() {
	isConfigMenuOpen.value = false
}

function startHolistic() {
	const videoElement = document.getElementById(
		'input_video'
	) as HTMLVideoElement
	mediationStore.startHolistic(videoElement)
}

function stopHolistic() {
	mediationStore.stopHolistic()
}

onMounted(async () => {
	const videoElement = document.getElementById(
		'input_video'
	) as HTMLVideoElement
	const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement
	const config: MediationConfig = {
		scene: sceneRoomRef.value as MeshRoomEnum,
		skybox: sceneSkyboxRef.value as SkyboxEnum,
		holisticComplexity: holisticComplexityRef.value,
		useHolistic: isHolisticActivatedRef.value,
	}
	await mediationStore.start(videoElement, canvas, config)
})
</script>

<template>
	<div class="mediation position-relative">
		<MediationUI
			:emotion="emotionRef"
			:is-config-menu-open="isConfigMenuOpen"
			:is-camera-preview-active="isCameraPreviewRef"
			:is-holistic-activated="isHolisticActivatedRef"
			:is-holistic-loading="isHolisticLoading"
			@open-config="openConfigMenu()"
			@enable-holistic="startHolistic()"
			@disable-holistic="stopHolistic()">
			<video id="input_video" :class="emotionRef.toLocaleLowerCase()"></video>
		</MediationUI>
		<MediationOptions
			:is-open="isConfigMenuOpen"
			@close="closeConfigMenu()"></MediationOptions>
		<canvas id="renderCanvas"></canvas>
	</div>
</template>

<style scoped src="./Mediation.scss"></style>
