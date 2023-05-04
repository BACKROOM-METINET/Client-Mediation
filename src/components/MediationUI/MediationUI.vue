<script setup lang="ts">
import { computed, ref, toRefs } from 'vue'
import type { Emotion } from '@/client/types/business'
import CameraIcon from '@/components/icons/CameraIcon.vue'
import CameraOffIcon from '@/components/icons/CameraOffIcon.vue'
import EyeIcon from '@/components/icons/EyeIcon.vue'
import EyeSlashIcon from '@/components/icons/EyeSlashIcon.vue'
import ParticipantsIcon from '@/components/icons/ParticipantsIcon.vue'
import SettingIcon from '@/components/icons/SettingIcon.vue'
import { useSceneStore } from '@/stores/babylon-js/scene'
import { useRoomStore } from '@/stores/room'
import { useSettingStore } from '@/stores/setting'

const settings = useSettingStore()
const scene = useSceneStore()
const room = useRoomStore()
const { fpsCounter } = toRefs(scene)
const { currentRoom } = toRefs(room)

const props = defineProps<{
	emotion: Emotion
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

const participants = computed(() => currentRoom.value?.participants ?? [])

const participantMenuOpen = ref(false)

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

function toggleParticipantMenu() {
	participantMenuOpen.value = !participantMenuOpen.value
}
</script>

<template>
	<div class="mediation-ui">
		<div class="ui-bottom-left position-absolute over-cam">
			<div class="cam" :class="{ hide: !isCameraPreviewActive }">
				<slot></slot>
			</div>
			<div class="aside-cam">
				<img
					width="35"
					:src="`src/assets/img/emoji_${emotion.toLocaleLowerCase()}.svg`"
					alt="your emotion" />
				<button
					id="btn-close-cam"
					class="over-item"
					type="button"
					:class="{ hide: !isCameraPreviewActive }"
					@click="closeCameraPreview()">
					<CameraOffIcon></CameraOffIcon>
				</button>
				<button
					id="btn-open-cam"
					type="button"
					class="over-item"
					:class="{ hide: isCameraPreviewActive }"
					@click="openCameraPreview()">
					<CameraIcon></CameraIcon>
				</button>
			</div>
		</div>
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
				<li>
					<button
						id="btn-participants-list"
						type="button"
						class="over-item"
						title="Participants List"
						@click="toggleParticipantMenu()">
						<ParticipantsIcon></ParticipantsIcon>
					</button>
				</li>
			</ul>
		</div>
		<div v-if="participantMenuOpen" class="participants-menu">
			<span class="menu-header">
				Participants : {{ currentRoom?.participants.length }}
			</span>
			<hr />
			<div class="menu-content">
				<div
					v-for="participant of participants"
					class="participant-data"
					:key="participant.name"
					:title="`role : ${participant.role}`">
					<span
						:class="{
							me: participant.isMe,
							mediator: participant.role === 'mediator',
							lawyer: participant.role === 'lawyer',
						}">
						{{ participant.name }}
					</span>
					<img
						width="20"
						:src="`src/assets/img/emoji_${participant.emotion.toLocaleLowerCase()}.svg`"
						alt="your emotion" />
				</div>
			</div>
		</div>
		<div class="fps-counter">{{ fpsCounter }} fps</div>
	</div>
</template>

<style scoped src="./MediationUI.scss"></style>
