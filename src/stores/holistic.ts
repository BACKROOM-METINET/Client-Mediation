import { Camera } from '@mediapipe/camera_utils'
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils'
import {
	Holistic,
	POSE_CONNECTIONS,
	type Options,
	type Results,
	FACEMESH_TESSELATION,
	HAND_CONNECTIONS,
} from '@mediapipe/holistic'
import { defineStore } from 'pinia'
import { ref, type Ref, toRefs, computed } from 'vue'
import type { CloneablePreResults } from '@/client/types/business'
import { useSettingStore } from './setting'

const RENDER_WIDTH = 1080
const RENDER_HEIGHT = 720

export const useHolisticStore = defineStore('holistic', () => {
	// Stores
	const settingStore = useSettingStore()
	const { holisticComplexityRef } = toRefs(settingStore)

	// States

	let camera: Camera | null = null
	const videoElement: Ref<HTMLVideoElement | null> = ref(null)

	let holistic: Holistic | null = null
	const holisticState: Ref<number> = ref(0)
	const holisticConfig: Ref<Options> = ref({
		modelComplexity: holisticComplexityRef.value,
		smoothLandmarks: true,
		enableSegmentation: false,
		smoothSegmentation: false,
		refineFaceLandmarks: true,
		minDetectionConfidence: 0.5,
		minTrackingConfidence: 0.55,
	})

	const _onResultsDefault = (
		results: Results,
		canvasElement: HTMLCanvasElement,
		canvasCtx: CanvasRenderingContext2D
	) => {
		if (!results.image) return
		canvasElement.width = RENDER_WIDTH
		canvasElement.height = RENDER_HEIGHT

		try {
			canvasCtx.save()
			canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height)
			canvasCtx.drawImage(
				results.segmentationMask,
				0,
				0,
				canvasElement.width,
				canvasElement.height
			)

			// Only overwrite existing pixels.
			canvasCtx.globalCompositeOperation = 'source-in'
			canvasCtx.fillStyle = '#00FF00'
			canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height)

			// Only overwrite missing pixels.
			canvasCtx.globalCompositeOperation = 'destination-atop'
			canvasCtx.drawImage(
				results.image,
				0,
				0,
				canvasElement.width,
				canvasElement.height
			)

			canvasCtx.globalCompositeOperation = 'source-over'
			drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
				color: '#00FF00',
				lineWidth: 4,
			})
			drawLandmarks(canvasCtx, results.poseLandmarks, {
				color: '#FF0000',
				lineWidth: 2,
			})
			drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION, {
				color: '#C0C0C070',
				lineWidth: 1,
			})
			drawConnectors(canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS, {
				color: '#CC0000',
				lineWidth: 5,
			})
			drawLandmarks(canvasCtx, results.leftHandLandmarks, {
				color: '#00FF00',
				lineWidth: 2,
			})
			drawConnectors(canvasCtx, results.rightHandLandmarks, HAND_CONNECTIONS, {
				color: '#00CC00',
				lineWidth: 5,
			})
			drawLandmarks(canvasCtx, results.rightHandLandmarks, {
				color: '#FF0000',
				lineWidth: 2,
			})
			canvasCtx.restore()
		} catch (err) {
			console.error(err)
		}
	}

	// Getters

	/**
	 * Return :
	 * - 0 = off
	 * - 1 = on
	 * - 2 = loading
	 * @return {ComputedRef<number>}
	 */
	const stateRef = computed(() => holisticState.value)

	function startCamera(_videoElement: HTMLVideoElement) {
		let status = true
		if (camera) {
			camera.stop()
			camera = null
		}
		camera = new Camera(_videoElement, {
			onFrame: async () => {
				// Half input fps. This version of Holistic is heavy on CPU time.
				// Wait until they fix web worker (https://github.com/google/mediapipe/issues/2506).
				if (status)
					await holistic?.send({
						image: _videoElement,
					})
				status = !status
			},
			width: RENDER_WIDTH,
			height: RENDER_HEIGHT,
		})
		camera.start()
	}

	// Actions

	function start(
		_videoElement: HTMLVideoElement,
		onResults = (_results: CloneablePreResults) => {}
	) {
		holisticState.value = 2
		videoElement.value = _videoElement
		holistic = new Holistic({
			locateFile: (file) => {
				return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`
			},
		})
		holistic.setOptions(holisticConfig.value)
		holistic.onResults((results) => {
			holisticState.value = 1
			onResults(results)
		})
		if (camera) {
			camera.stop()
			camera = null
		}
		let status = true
		const cam = new Camera(_videoElement, {
			onFrame: async () => {
				// Half input fps. This version of Holistic is heavy on CPU time.
				// Wait until they fix web worker (https://github.com/google/mediapipe/issues/2506).
				if (status)
					await holistic?.send({
						image: _videoElement,
					})
				status = !status
			},
			width: RENDER_WIDTH,
			height: RENDER_HEIGHT,
		})
		cam.start()
	}
	function reset() {
		holistic?.reset()
		holisticState.value = 2
	}
	function close() {
		holistic?.close()
		holistic = null
		holisticState.value = 0
	}
	return { stateRef, startCamera, start, reset, close }
})
