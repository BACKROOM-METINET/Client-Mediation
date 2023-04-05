<!-- eslint-disable unused-imports/no-unused-vars -->
<script setup lang="ts">
import '@babylonjs/core/Debug/debugLayer'

import '@babylonjs/loaders/glTF'
import 'babylonjs-loaders'
import '@babylonjs/loaders/OBJ/objFileLoader'

import { onMounted, ref, toRefs } from 'vue'
import { mediation, isLoading } from '@/client/core'
import type { MediationConfig } from '@/client/types/config'
import type { MeshRoomEnum, SkyboxEnum } from '@/client/types/meshes'
import CameraIcon from '@/components/icons/CameraIcon.vue'
import CloseIcon from '@/components/icons/CloseIcon.vue'
import EyeIcon from '@/components/icons/EyeIcon.vue'
import EyeSlashIcon from '@/components/icons/EyeSlashIcon.vue'
import SettingIcon from '@/components/icons/SettingIcon.vue'
import MediationOptions from '@/components/MediationOptions/MediationOptions.vue'
import { useSceneStore } from '@/stores/scene'
import { useSettingStore } from '@/stores/setting'

const settings = useSettingStore()
const {
	holisticComplexityRef,
	sceneRoomRef,
	sceneSkyboxRef,
	isCameraPreviewRef,
} = toRefs(settings)
const scene = useSceneStore()
const { fpsCounter } = toRefs(scene)

const isHolisticActive = ref(true)
const isConfigMenuOpen = ref(false)

function closeConfigMenu() {
	isConfigMenuOpen.value = false
}

function openCameraPreview() {
	settings.setCameraPreview(true)
}

function closeCameraPreview() {
	settings.setCameraPreview(false)
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
	}
	const core = await mediation(videoElement, canvas, config)
	core.startHolistic()
})
</script>

<template>
	<div class="component position-relative">
		<div
			class="position-absolute over-cam cam"
			:class="{ hide: !isCameraPreviewRef }">
			<video id="input_video"></video>
			<button id="btn-close-cam" type="button" @click="closeCameraPreview()">
				<CloseIcon></CloseIcon>
			</button>
		</div>
		<button
			id="btn-open-cam"
			type="button"
			class="position-absolute over-cam over-item"
			:class="{ hide: isCameraPreviewRef }"
			@click="openCameraPreview()">
			<CameraIcon></CameraIcon>
		</button>
		<div class="position-absolute option-list">
			<ul>
				<li v-if="isLoading">
					<div class="over-item" title="Mediapipe Holistic Loading">
						<span
							class="spinner-border spinner-border-sm text-dark"
							role="status"
							aria-hidden="true"></span>
					</div>
				</li>
				<li>
					<button
						id="btn-open-cam"
						type="button"
						class="over-item"
						title="Settings Menu"
						@click="isConfigMenuOpen = true">
						<SettingIcon></SettingIcon>
					</button>
				</li>
				<li>
					<button
						v-if="isHolisticActive"
						id="btn-open-cam"
						type="button"
						class="over-item"
						title="Mediapipe View Disable"
						@click="isHolisticActive = false">
						<EyeSlashIcon></EyeSlashIcon>
					</button>
					<button
						v-else
						id="btn-open-cam"
						type="button"
						class="over-item"
						title="Mediapipe View Enable"
						@click="isHolisticActive = true">
						<EyeIcon></EyeIcon>
					</button>
				</li>
			</ul>
		</div>
		<div class="fps-counter">{{ fpsCounter }} fps</div>
		<MediationOptions
			:is-open="isConfigMenuOpen"
			@close="closeConfigMenu()"></MediationOptions>
		<canvas id="renderCanvas"></canvas>
	</div>
</template>

<style scoped src="./NewUI.scss"></style>
