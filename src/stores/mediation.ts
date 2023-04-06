import '@babylonjs/core/Debug/debugLayer'

import '@babylonjs/loaders/glTF'
import 'babylonjs-loaders'
import '@babylonjs/loaders/OBJ/objFileLoader'

import * as Comlink from 'comlink'
import { defineStore } from 'pinia'
import { ref, type Ref, toRefs, computed } from 'vue'
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

	const worker: Ref<Worker | null> = ref(null)
	const poseWorker: Ref<Comlink.Remote<Pose> | null> = ref(null)

	// Getters

	const isHolisticLoading = computed(() => holisticStateRef.value === 2)

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
		if (config.useHolistic)
			holisticStore.start(videoSource, async (results) => {
				delete results.image
				if (!results.poseLandmarks) return
				poseWorker.value?.process(results).then(async () => {
					sceneStore.onHolisticResult(poseWorker.value as Comlink.Remote<Pose>)
				})
			})
	}

	function startHolistic(videoSource: HTMLVideoElement) {
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

	return { isHolisticLoading, start, startHolistic, stopHolistic }
})
