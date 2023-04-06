import '@babylonjs/core/Debug/debugLayer'

import '@babylonjs/loaders/glTF'
import 'babylonjs-loaders'
import '@babylonjs/loaders/OBJ/objFileLoader'

import * as Comlink from 'comlink'
import { defineStore } from 'pinia'
import { ref, type Ref, toRefs, computed } from 'vue'
import type { Expression } from '@/client/types/business'
import type { MediationConfig } from '@/client/types/config'
import type { Pose, poseWrapper } from '@/client/workers/pose-processing'
import { useSceneStore } from './babylon-js/scene'
import { useHolisticStore } from './holistic'

export const useMediationStore = defineStore('mediation', () => {
	// Stores
	const sceneStore = useSceneStore()
	const holisticStore = useHolisticStore()
	const { stateRef: holisticStateRef } = toRefs(holisticStore)

	// States

	let webSocketExpression: WebSocket | null = null
	const expression: Ref<Expression> = ref('Neutral')
	const worker: Ref<Worker | null> = ref(null)
	const poseWorker: Ref<Comlink.Remote<Pose> | null> = ref(null)

	// Getters

	const isHolisticLoading = computed(() => holisticStateRef.value === 2)
	const expressionRef = computed(() => expression.value)

	// Actions

	async function start(
		videoSource: HTMLVideoElement,
		babylonCanvas: HTMLCanvasElement,
		config: MediationConfig = { useHolistic: true }
	) {
		worker.value = new Worker(
			new URL('../client/workers/pose-processing.ts', import.meta.url),
			{
				type: 'module',
			}
		)
		const remoteComlink = Comlink.wrap<typeof poseWrapper>(worker.value)
		poseWorker.value = await new remoteComlink.pose()
		sceneStore.render(babylonCanvas, poseWorker.value, config)
		if (config.useHolistic) {
			holisticStore.start(videoSource, async (results) => {
				delete results.image
				if (!results.poseLandmarks) return
				poseWorker.value?.process(results).then(async () => {
					sceneStore.onHolisticResult(poseWorker.value as Comlink.Remote<Pose>)
				})
			})
		} else {
			holisticStore.startCamera(videoSource)
		}
		startExpressionConnection(videoSource)
	}

	function calcExpression(image: HTMLImageElement) {
		const canvas = document.createElement('canvas')
		const context = canvas.getContext('2d')
		canvas.width = image.width
		canvas.height = image.height
		context?.drawImage(image, 0, 0)
		canvas.toBlob(
			(blob) => {
				console.log(blob === null)
				if (blob) webSocketExpression?.send(blob)
			},
			'image/png',
			0.9
		)
	}

	function startExpressionConnection(videoSource: HTMLVideoElement) {
		console.log('🤖 AI Server Expression : Connection...')
		webSocketExpression = new WebSocket('ws://localhost:8765')

		webSocketExpression.onopen = () => {
			console.log('🤖 AI Server Expression : Connection established !')
			const img = document.createElement('img')
			img.style.display = 'none'
			document.body.appendChild(img)
			async function captureImage() {
				const canvas = document.createElement('canvas')
				canvas.width = 300
				canvas.height = 200
				const ctx = canvas.getContext('2d')
				if (!ctx) return
				ctx.drawImage(videoSource, 0, 0, canvas.width, canvas.height)

				const imageURL = canvas.toDataURL('image/png')

				img.src = imageURL
				img.onload = () => calcExpression(img)
			}
			setInterval(captureImage, 5000)
		}

		webSocketExpression.onmessage = (event) => {
			// console.log('@Message', event.data)
			const msg = JSON.parse(event.data)
			if (msg.event === '@ExpressionResult') {
				expression.value = msg.result ?? 'Neutral'
			}
		}
	}

	function startHolistic(videoSource: HTMLVideoElement) {
		// startExpressionConnection()
		holisticStore.start(videoSource, async (results) => {
			delete results.image
			if (!results.poseLandmarks) return
			poseWorker.value?.process(results).then(async () => {
				sceneStore.onHolisticResult(poseWorker.value as Comlink.Remote<Pose>)
			})
		})
	}

	function stopHolistic() {
		holisticStore.close()
	}

	return {
		isHolisticLoading,
		expressionRef,
		start,
		startHolistic,
		stopHolistic,
	}
})
