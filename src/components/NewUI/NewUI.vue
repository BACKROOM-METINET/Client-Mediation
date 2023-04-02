<!-- eslint-disable unused-imports/no-unused-vars -->
<script setup lang="ts">
import '@babylonjs/core/Debug/debugLayer'

import '@babylonjs/loaders/glTF'
import 'babylonjs-loaders'
import '@babylonjs/loaders/OBJ/objFileLoader'

import { computed, onMounted, ref, toRefs } from 'vue'
import { mediation, isLoading } from '@/client/core'
import type { Complexity } from '@/client/types/business'
import { MeshRoomEnum } from '@/client/types/meshes'
import CameraIcon from '@/components/icons/CameraIcon.vue'
import CloseIcon from '@/components/icons/CloseIcon.vue'
import EyeIcon from '@/components/icons/EyeIcon.vue'
import EyeSlashIcon from '@/components/icons/EyeSlashIcon.vue'
import SettingIcon from '@/components/icons/SettingIcon.vue'
import { useSceneStore } from '@/stores/scene'
import { useSettingStore } from '@/stores/setting'
import { MediationConfig } from '../../client/types/config'

const settings = useSettingStore()
const { holisticComplexityRef, sceneRoomRef } = toRefs(settings)
const scene = useSceneStore()
const { fpsCounter } = toRefs(scene)

const isCameraActive = ref(true)
const isMediapipeViewActive = ref(true)
const isSettingMenuOpen = ref(false)
const currentRoom = ref(sceneRoomRef.value ?? MeshRoomEnum.PROTOTYPE_01)

function setComplexity($event: Event) {
	settings.setHolysticComplexity(
		+($event.target as HTMLInputElement).value as Complexity
	)
	window.location.reload()
}

function setRoom($event: Event) {
	console.log(($event.target as HTMLSelectElement).value)
	settings.setSceneRoom(($event.target as HTMLSelectElement).value as any)
	window.location.reload()
}

const roomEnums = computed(() => {
	const roomNames = []
	for (const key in MeshRoomEnum) {
		roomNames.push(key)
	}
	return roomNames
})

onMounted(async () => {
	const videoElement = document.getElementById(
		'input_video'
	) as HTMLVideoElement
	const canvasElement = document.getElementById(
		'output_canvas'
	) as HTMLCanvasElement
	const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement
	// mediation(videoElement, canvasElement, canvas)
	const config: MediationConfig = {
		scene: sceneRoomRef.value as MeshRoomEnum,
		holisticComplexity: holisticComplexityRef.value,
	}
	const core = await mediation(videoElement, canvasElement, canvas, config)
	core.startHolistic()
})
</script>

<template>
	<div class="component position-relative">
		<div
			class="position-absolute over-cam cam"
			:class="{ hide: !isCameraActive }">
			<video id="input_video" :class="{ hide: !isLoading }"></video>
			<canvas id="output_canvas" :class="{ hide: isLoading }"></canvas>
			<button id="btn-close-cam" type="button" @click="isCameraActive = false">
				<CloseIcon></CloseIcon>
			</button>
		</div>
		<button
			id="btn-open-cam"
			type="button"
			class="position-absolute over-cam over-item"
			:class="{ hide: isCameraActive }"
			@click="isCameraActive = true">
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
						@click="isSettingMenuOpen = true">
						<SettingIcon></SettingIcon>
					</button>
				</li>
				<li>
					<button
						v-if="isMediapipeViewActive"
						id="btn-open-cam"
						type="button"
						class="over-item"
						title="Mediapipe View Disable"
						@click="isMediapipeViewActive = false">
						<EyeSlashIcon></EyeSlashIcon>
					</button>
					<button
						v-else
						id="btn-open-cam"
						type="button"
						class="over-item"
						title="Mediapipe View Enable"
						@click="isMediapipeViewActive = true">
						<EyeIcon></EyeIcon>
					</button>
				</li>
			</ul>
		</div>
		<div class="fps-counter">{{ fpsCounter }} fps</div>
		<div
			id="settings-menu"
			class="position-absolute"
			:class="{ open: isSettingMenuOpen }">
			<div class="settings-form">
				<h2>Settings</h2>
				<div class="my-2">
					<label for="HolisticComplexityInput" class="form-label">
						Holistic complexity : {{ holisticComplexityRef }}
					</label>
					<input
						type="range"
						class="form-range"
						id="HolisticComplexityInput"
						v-model="holisticComplexityRef"
						min="0"
						max="2"
						@change="setComplexity($event)" />
				</div>
				<div class="my-2">
					<label for="RoomSelect" class="form-label">
						Current Mediation Room
					</label>
					<select
						id="RoomSelect"
						class="form-select"
						aria-label=""
						v-model="currentRoom"
						@change="setRoom($event)">
						<option v-for="room in roomEnums" :key="room" :value="room">
							{{ room }}
						</option>
					</select>
				</div>

				<button
					id="btn-close-settings"
					type="button"
					@click="isSettingMenuOpen = false">
					<CloseIcon></CloseIcon>
				</button>
			</div>
		</div>
		<canvas id="renderCanvas"></canvas>
	</div>
</template>

<style scoped src="./NewUI.scss"></style>
