<script setup lang="ts">
import { toRefs } from 'vue'
import CameraIcon from '@/components/icons/CameraIcon.vue'
import CloseIcon from '@/components/icons/CloseIcon.vue'
import EyeIcon from '@/components/icons/EyeIcon.vue'
import EyeSlashIcon from '@/components/icons/EyeSlashIcon.vue'
import SettingIcon from '@/components/icons/SettingIcon.vue'
import { useSceneStore } from '@/stores/babylon-js/scene'
import { useSettingStore } from '@/stores/setting'

const settings = useSettingStore()
const scene = useSceneStore()
const { fpsCounter } = toRefs(scene)

const props = defineProps<{
	isCameraPreviewActive: boolean
	isHolisticActivated: boolean
	isHolisticLoading: boolean
	isConfigMenuOpen: boolean
}>()
const emits = defineEmits<{
	(event: 'open-config'): void
	(event: 'enable-holistic'): void
	(event: 'disable-holistic'): void
}>()

function openConfigMenu() {
	emits('open-config')
}

function openCameraPreview() {
	settings.setCameraPreview(true)
}

function closeCameraPreview() {
	settings.setCameraPreview(false)
}

function enableHolistic() {
	emits('enable-holistic')
	settings.setHolisticActivated(true)
}

function disableHolistic() {
	emits('disable-holistic')
	settings.setHolisticActivated(false)
}
</script>

<template>
	<div class="mediation-ui">
		<div
			class="position-absolute over-cam cam"
			:class="{ hide: !isCameraPreviewActive }">
			<slot></slot>
			<button id="btn-close-cam" type="button" @click="closeCameraPreview()">
				<CloseIcon></CloseIcon>
			</button>
		</div>
		<button
			id="btn-open-cam"
			type="button"
			class="position-absolute over-cam over-item"
			:class="{ hide: isCameraPreviewActive }"
			@click="openCameraPreview()">
			<CameraIcon></CameraIcon>
		</button>
		<div class="position-absolute option-list">
			<ul>
				<li v-if="isHolisticLoading">
					<div class="over-item" title="Holistic Loading...">
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
						@click="openConfigMenu()">
						<SettingIcon></SettingIcon>
					</button>
				</li>
				<li>
					<button
						v-if="props.isHolisticActivated"
						id="btn-open-cam"
						type="button"
						class="over-item"
						title="Holistic Disable"
						@click="disableHolistic()">
						<EyeSlashIcon></EyeSlashIcon>
					</button>
					<button
						v-else
						id="btn-open-cam"
						type="button"
						class="over-item"
						title="Holistic Enable"
						@click="enableHolistic">
						<EyeIcon></EyeIcon>
					</button>
				</li>
			</ul>
		</div>
		<div class="fps-counter">{{ fpsCounter }} fps</div>
	</div>
</template>

<style scoped src="./MediationUI.scss"></style>
