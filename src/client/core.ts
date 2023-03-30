import '@babylonjs/core/Debug/debugLayer'

import '@babylonjs/loaders/glTF'
import 'babylonjs-loaders'
import '@babylonjs/loaders/OBJ/objFileLoader'

import type { Results } from '@mediapipe/holistic'
import { ref, toRefs } from 'vue'
import { useCameraStore } from '@/stores/camera'
import { useSceneStore } from '@/stores/scene'
import { useSettingStore } from '@/stores/setting'
import { useHolisticService } from './services/holistic'
import type { Camera } from './types/business'

export function mediation(
	videoSource: HTMLVideoElement,
	outputCanvas: HTMLCanvasElement,
	babylonCanvas: HTMLCanvasElement,
	_config?: any
) {
	// Stores
	const settings = useSettingStore()
	const camera = useCameraStore()
	const scene = useSceneStore()
	const { holisticComplexity } = toRefs(settings)
	const { avatarRef, cameraRef } = toRefs(scene)

	// Services
	const holisticService = useHolisticService()

	// Variables
	const canvasCtx = outputCanvas.getContext('2d') as CanvasRenderingContext2D
	const isLoading = ref<boolean>(true)
	// const isCameraActive = ref(true)
	const isMediapipeViewActive = ref(true)
	// const isSettingMenuOpen = ref(false)

	scene.render(babylonCanvas)

	function startHolistic() {
		holisticService.holistic(
			videoSource,
			async (results: Results) => {
				isLoading.value = false
				if (results.poseLandmarks && isMediapipeViewActive.value) {
					camera.onHolisticResult(results.poseLandmarks)
				}
				if (cameraRef.value) {
					if (results.leftHandLandmarks) {
						avatarRef.value?.hands.left.updateEvent(
							cameraRef.value as Camera,
							results.leftHandLandmarks
						)
					}
					if (results.rightHandLandmarks) {
						avatarRef.value?.hands.right.updateEvent(
							cameraRef.value as Camera,
							results.rightHandLandmarks
						)
					}
				}
				holisticService.onResults(results, outputCanvas, canvasCtx)
			},
			holisticComplexity.value
		)
	}

	return { startHolistic }
}
