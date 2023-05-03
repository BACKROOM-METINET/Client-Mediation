import '@babylonjs/core/Debug/debugLayer'

import '@babylonjs/loaders/glTF'
import 'babylonjs-loaders'
import '@babylonjs/loaders/OBJ/objFileLoader'

import * as Comlink from 'comlink'
import { defineStore } from 'pinia'
import { ref, type Ref, toRefs, computed } from 'vue'
import type { AvatarData, Emotion } from '@/client/types/business'
import type { MediationConfig } from '@/client/types/config'
import type { Pose, poseWrapper } from '@/client/workers/pose-processing'
import { useHighLevelClientEmits } from '@/composables/emits'
import { useSceneStore } from './babylon-js/scene'
import { useHolisticStore } from './holistic'
import { useRoomStore } from './room'

export const useMediationStore = defineStore('mediation', () => {
	// Stores
	const clientEmits = useHighLevelClientEmits()
	const sceneStore = useSceneStore()
	const holisticStore = useHolisticStore()
	const roomStore = useRoomStore()
	const { stateRef: holisticStateRef } = toRefs(holisticStore)
	const { currentRoom, currentUser } = toRefs(roomStore)

	// States

	let webSocketEmotion: WebSocket | null = null
	const emotion: Ref<Emotion> = ref('Neutral')
	const worker: Ref<Worker | null> = ref(null)
	const poseWorker: Ref<Comlink.Remote<Pose> | null> = ref(null)

	// Getters

	const isHolisticLoading = computed(() => holisticStateRef.value === 2)
	const emotionRef = computed(() => emotion.value)

	// Actions

	async function start(
		videoSource: HTMLVideoElement,
		babylonCanvas: HTMLCanvasElement,
		config: MediationConfig = { useHolistic: true }
	) {
		// Start Web-Worker
		worker.value = new Worker(
			new URL('../client/workers/pose-processing.ts', import.meta.url),
			{
				type: 'module',
			}
		)
		const remoteComlink = Comlink.wrap<typeof poseWrapper>(worker.value)
		poseWorker.value = await new remoteComlink.pose()

		// Start BabylonJS
		if (currentRoom.value) sceneStore.setRoomRef(currentRoom.value.participants)
		sceneStore.render(babylonCanvas, poseWorker.value, config)

		// Start Holistic
		if (config.useHolistic) {
			holisticStore.start(videoSource, async (results) => {
				delete results.image
				if (!results.poseLandmarks) return
				poseWorker.value
					?.process(results)
					.then(async (avatarData: AvatarData | null) => {
						if (avatarData && currentRoom.value && currentUser.value) {
							clientEmits.sendAvatarData(
								currentUser.value.name,
								currentRoom.value.id,
								{ ...avatarData, emotion: emotion.value }
							)
						}
						sceneStore.onHolisticResult(
							poseWorker.value as Comlink.Remote<Pose>
						)
					})
			})
		} else {
			holisticStore.startCamera(videoSource)
		}
		startEmotionConnection(videoSource)
	}

	function calcEmotion(image: HTMLImageElement) {
		const canvas = document.createElement('canvas')
		const context = canvas.getContext('2d')
		canvas.width = image.width
		canvas.height = image.height
		context?.drawImage(image, 0, 0)
		canvas.toBlob(
			(blob) => {
				if (blob) webSocketEmotion?.send(blob)
			},
			'image/png',
			0.9
		)
	}

	function startEmotionConnection(videoSource: HTMLVideoElement) {
		console.log('🤖 AI Server Emotion : Connection...')
		webSocketEmotion = new WebSocket('ws://localhost:8765')

		webSocketEmotion.onopen = () => {
			console.log('🤖 AI Server Emotion : Connection established !')
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
				img.onload = () => calcEmotion(img)
			}
			setInterval(captureImage, 1000)
		}

		webSocketEmotion.onmessage = (event) => {
			const msg = JSON.parse(event.data)
			if (msg.event === '@EmotionResult') {
				emotion.value = msg.result ?? 'Neutral'
			}
		}
	}

	function startHolistic(videoSource: HTMLVideoElement) {
		holisticStore.start(videoSource, async (results) => {
			delete results.image
			if (!results.poseLandmarks) return
			poseWorker.value?.process(results).then(async () => {
				sceneStore.onHolisticResult(poseWorker.value as Comlink.Remote<Pose>)
			})
		})
		startEmotionConnection(videoSource)
	}

	function stopHolistic() {
		holisticStore.close()
	}

	return {
		isHolisticLoading,
		emotionRef,
		start,
		startHolistic,
		stopHolistic,
	}
})
