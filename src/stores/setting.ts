import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Complexity } from '@/client/types/business'
import type { MeshRoomEnum, SkyboxEnum } from '@/client/types/meshes'

const KEY_HOLISTIC = 'holystic-activated'
const KEY_HOLISTIC_COMPLEXITY = 'holystic-complexity'
const KEY_SCENE_ROOM = 'scene-room'
const KEY_SCENE_SKYBOX = 'scene-skybox'

export const useSettingStore = defineStore('setting', () => {
	// States

	const isCameraPreview = ref<boolean>(
		localStorage.getItem(KEY_HOLISTIC) === '1' ? true : false
	)

	const holisticComplexity = ref<Complexity>(
		Number.parseInt(
			localStorage.getItem(KEY_HOLISTIC_COMPLEXITY) ?? '1'
		) as Complexity
	)

	const sceneRoom = ref<keyof typeof MeshRoomEnum | undefined>(
		(localStorage.getItem(KEY_SCENE_ROOM) as keyof typeof MeshRoomEnum) ??
			undefined
	)

	const sceneSkybox = ref<keyof typeof SkyboxEnum | undefined>(
		(localStorage.getItem(KEY_SCENE_SKYBOX) as keyof typeof SkyboxEnum) ??
			undefined
	)

	// Getters

	const isCameraPreviewRef = computed(() => isCameraPreview.value)
	const holisticComplexityRef = computed(() => holisticComplexity.value)
	const sceneRoomRef = computed(() => sceneRoom.value)
	const sceneSkyboxRef = computed(() => sceneSkybox.value)

	// Actions

	function setCameraPreview(activated: boolean) {
		localStorage.setItem(KEY_HOLISTIC, activated ? '1' : '0')
		isCameraPreview.value = activated
	}

	function setHolysticComplexity(complexity: Complexity) {
		localStorage.setItem(KEY_HOLISTIC_COMPLEXITY, complexity.toString())
		holisticComplexity.value = complexity
	}

	function setSceneRoom(room: keyof typeof MeshRoomEnum) {
		localStorage.setItem(KEY_SCENE_ROOM, room)
		sceneRoom.value = room
	}

	function setSkybox(skybox: keyof typeof SkyboxEnum) {
		localStorage.setItem(KEY_SCENE_SKYBOX, skybox)
		sceneSkybox.value = skybox
	}

	return {
		isCameraPreviewRef,
		holisticComplexityRef,
		sceneRoomRef,
		sceneSkyboxRef,
		setCameraPreview,
		setHolysticComplexity,
		setSceneRoom,
		setSkybox,
	}
})
