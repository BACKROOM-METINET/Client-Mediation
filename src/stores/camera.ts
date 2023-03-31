import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Camera } from '@/client/types/business'

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

	return {
		cameraRef,
		setCamera,
		setCameraRotation,
	}
})
