import type {
	NormalizedLandmark,
	NormalizedLandmarkList,
} from '@mediapipe/holistic'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Camera } from '@/client/types/business'

function calculRotateX(
	c0: NormalizedLandmark,
	c7: NormalizedLandmark,
	c8: NormalizedLandmark
) {
	const perc = ((c0.x - c8.x) * 100) / (c7.x - c8.x)
	return (perc - 50) / -100
}

function calculRotateY(
	c1: NormalizedLandmark,
	c4: NormalizedLandmark,
	c7: NormalizedLandmark,
	c8: NormalizedLandmark
) {
	const center1 = { x: (c4.x + c1.x) / 2, y: (c4.y + c1.y) / 2 }
	const center2 = { x: (c8.x + c7.x) / 2, y: (c8.y + c7.y) / 2 }
	return (center1.y - center2.y + 0.02) * 10
}

export const useCameraStore = defineStore('camera', () => {
	// States

	const camera = ref<Camera | null>(null)

	// Getters

	const cameraRef = computed(() => camera.value)

	// Actions

	function setCamera(_camera: Camera) {
		camera.value = _camera
	}

	async function setCameraRotation(
		rotateX: number,
		rotateY: number
	): Promise<void> {
		if (!camera.value) return
		camera.value.rotation.x = rotateX // ? modif hedi
		camera.value.rotation.y = rotateY // ? modif hedi
	}

	async function onHolisticResult(
		coords: NormalizedLandmarkList
	): Promise<void> {
		if (!coords[0] || !coords[1] || !coords[4] || !coords[7] || !coords[8])
			return
		setCameraRotation(
			calculRotateX(coords[0], coords[7], coords[8]),
			calculRotateY(coords[1], coords[4], coords[7], coords[8])
		)
	}

	return {
		cameraRef,
		setCamera,
		setCameraRotation,
		onHolisticResult,
	}
})
