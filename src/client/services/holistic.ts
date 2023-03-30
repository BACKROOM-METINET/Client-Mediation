import { Camera } from '@mediapipe/camera_utils'
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils'
import {
	FACEMESH_TESSELATION,
	HAND_CONNECTIONS,
	Holistic,
	POSE_CONNECTIONS,
	type Results,
} from '@mediapipe/holistic'
import type { Complexity } from '../types/business'

const RENDER_WIDTH = window.innerWidth / 2
const RENDER_HEIGHT = window.innerHeight / 2

export function useHolisticService() {
	function holistic(
		videoElement: HTMLVideoElement,
		onResults: (results: Results) => void,
		holisticComplexity: Complexity = 1
	) {
		const holistic = new Holistic({
			locateFile: (file) => {
				return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`
			},
		})
		holistic.setOptions({
			modelComplexity: holisticComplexity,
			smoothLandmarks: true,
			enableSegmentation: true,
			smoothSegmentation: true,
			refineFaceLandmarks: true,
			minDetectionConfidence: 0.5,
			minTrackingConfidence: 0.5,
		})
		holistic.onResults(onResults)
		const camera = new Camera(videoElement, {
			onFrame: async () => {
				await holistic.send({ image: videoElement })
			},
			width: window.innerWidth / 2,
			height: window.innerHeight / 2,
		})
		camera.start()
	}

	function onResults(
		results: any,
		canvasElement: HTMLCanvasElement,
		canvasCtx: CanvasRenderingContext2D
	) {
		if (!results.za) return
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

	return { holistic, onResults }
}
