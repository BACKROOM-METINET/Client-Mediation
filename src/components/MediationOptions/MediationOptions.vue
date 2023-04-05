<script setup lang="ts">
import { computed, ref, toRefs } from 'vue'
import type { Complexity } from '@/client/types/business'
import { MeshRoomEnum, SkyboxEnum } from '@/client/types/meshes'
import { useSceneStore } from '@/stores/scene'
import { useSettingStore } from '@/stores/setting'

const settings = useSettingStore()
const scene = useSceneStore()
const { holisticComplexityRef, sceneRoomRef, sceneSkyboxRef } = toRefs(settings)

const props = defineProps<{
	isOpen: boolean
}>()

const emits = defineEmits<{
	(event: 'close'): void
}>()

const currentRoom = ref(sceneRoomRef.value ?? MeshRoomEnum.PROTOTYPE_01)

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

function toSkyboxImgURL(name: string): string {
	return `assets/skyboxes/preview/${name.toLocaleLowerCase()}_preview.png`
}

function close() {
	emits('close')
}
</script>
<template>
	<div>
		<div
			id="settings-menu"
			class="position-absolute"
			:class="{ open: props.isOpen }">
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

				<button id="btn-close-settings" type="button" @click="close()">
					<CloseIcon></CloseIcon>
				</button>
			</div>
		</div>
	</div>
</template>

<style scoped src="./MediationConfig.scss"></style>
