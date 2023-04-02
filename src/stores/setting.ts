import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Complexity } from '@/client/types/business'
import type { MeshRoomEnum } from '@/client/types/meshes'

const KEY_HOLISTIC_COMPLEXITY = 'holystic-complexity'
const KEY_SCENE_ROOM = 'scene-room'

export const useSettingStore = defineStore('setting', () => {
	// States

	const holisticComplexity = ref<Complexity>(
		Number.parseInt(
			localStorage.getItem(KEY_HOLISTIC_COMPLEXITY) ?? '1'
		) as Complexity
	)

	const sceneRoom = ref<keyof typeof MeshRoomEnum | undefined>(
		(localStorage.getItem(KEY_SCENE_ROOM) as keyof typeof MeshRoomEnum) ??
			undefined
	)

	// Getters

	const holisticComplexityRef = computed(() => holisticComplexity.value)
	const sceneRoomRef = computed(() => sceneRoom.value)

	// Actions

	function setHolysticComplexity(complexity: Complexity) {
		localStorage.setItem(KEY_HOLISTIC_COMPLEXITY, complexity.toString())
		holisticComplexity.value = complexity
	}

	function setSceneRoom(room: keyof typeof MeshRoomEnum) {
		localStorage.setItem(KEY_SCENE_ROOM, room)
		sceneRoom.value = room
	}

	return {
		holisticComplexityRef,
		sceneRoomRef,
		setHolysticComplexity,
		setSceneRoom,
	}
})
