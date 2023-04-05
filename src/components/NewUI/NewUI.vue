<!-- eslint-disable unused-imports/no-unused-vars -->
<script setup lang="ts">
import '@babylonjs/core/Debug/debugLayer'

import '@babylonjs/loaders/glTF'
import 'babylonjs-loaders'
import '@babylonjs/loaders/OBJ/objFileLoader'

import { computed, onMounted, ref, toRefs } from 'vue'
import { mediation, isLoading } from '@/client/core'
import type { Complexity } from '@/client/types/business'
import type { MediationConfig } from '@/client/types/config'
import { MeshRoomEnum, SkyboxEnum } from '@/client/types/meshes'
import CameraIcon from '@/components/icons/CameraIcon.vue'
import CloseIcon from '@/components/icons/CloseIcon.vue'
import EyeIcon from '@/components/icons/EyeIcon.vue'
import EyeSlashIcon from '@/components/icons/EyeSlashIcon.vue'
import SettingIcon from '@/components/icons/SettingIcon.vue'
import { useSceneStore } from '@/stores/scene'
import { useSettingStore } from '@/stores/setting'

const settings = useSettingStore()
const { holisticComplexityRef, sceneRoomRef, sceneSkyboxRef } = toRefs(settings)
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
	settings.setSceneRoom(($event.target as HTMLSelectElement).value as any)
	window.location.reload()
}

function setSkybox($event: Event) {
	settings.setSkybox(($event.target as HTMLSelectElement).value as any)
	scene.setSkybox(sceneSkyboxRef.value as SkyboxEnum)
}

const roomEnums = computed(() => {
	const roomNames = []
	for (const key in MeshRoomEnum) {
		roomNames.push(key)
	}
	return roomNames
})

const skyEnums = computed(() => {
	const skyNames = []
	for (const key in SkyboxEnum) {
		skyNames.push(key)
	}
	return skyNames
})

onMounted(async () => {
	const videoElement = document.getElementById(
		'input_video'
	) as HTMLVideoElement
	const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement
	// mediation(videoElement, canvasElement, canvas)
	const config: MediationConfig = {
		scene: sceneRoomRef.value as MeshRoomEnum,
		skybox: sceneSkyboxRef.value as SkyboxEnum,
		holisticComplexity: holisticComplexityRef.value,
	}
	const core = await mediation(videoElement, canvas, config)
	// core.startHolistic()
})

function toSkyboxImgURL(name: string): string {
	return `assets/skyboxes/preview/${name.toLocaleLowerCase()}_preview.png`
}
</script>

<template>
	<div class="component position-relative">
		<div
			class="position-absolute over-cam cam"
			:class="{ hide: !isCameraActive }">
			<video id="input_video"></video>
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
						Holistic complexity : {{ holisticComplexityRef }} (*reload)
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
						Current Mediation Room (*reload)
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
				<div class="my-2">
					<label for="SkyboxSelect" class="form-label">
						Current Mediation Sky
					</label>
					<div id="SkyboxSelect">
						<div
							v-for="sky in skyEnums"
							:key="sky"
							class="form-check form-check-inline">
							<input
								class="btn-check"
								type="radio"
								name="inlineRadioOptions"
								:id="'radio' + sky"
								:value="sky"
								@change="setSkybox($event)" />
							<label class="btn btn-dark" :for="'radio' + sky">
								<img
									:src="toSkyboxImgURL(sky)"
									class="img-thumbnail"
									alt="preview"
									width="75" />
							</label>
						</div>
					</div>
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
