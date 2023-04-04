import '@babylonjs/core/Debug/debugLayer'

import '@babylonjs/loaders/glTF'
import 'babylonjs-loaders'
import '@babylonjs/loaders/OBJ/objFileLoader'

import * as Comlink from 'comlink'
import { ref } from 'vue'
import { useSceneStore } from '@/stores/scene'
import { useHolisticService } from './services/holistic'
import type { CloneablePreResults } from './types/business'
import type { MediationConfig } from './types/config'
import type { poseWrapper } from './workers/pose-processing'

export const isLoading = ref<boolean>(true)

export async function mediation(
	videoSource: HTMLVideoElement,
	babylonCanvas: HTMLCanvasElement,
	config: MediationConfig = {}
) {
	// Stores
	const sceneStore = useSceneStore()

	// Services
	const holisticService = useHolisticService()

	// Variables
	const worker = new Worker(
		new URL('./workers/pose-processing.ts', import.meta.url),
		{
			type: 'module',
		}
	)
	const remoteComlink = Comlink.wrap<typeof poseWrapper>(worker)
	const poseWorker = await new remoteComlink.pose()

	sceneStore.render(babylonCanvas, poseWorker, config)
	function startHolistic() {
		holisticService.holistic(
			videoSource,
			async (results: CloneablePreResults) => {
				isLoading.value = false
				delete results.image
				if (!results.poseLandmarks) return
				poseWorker.process(results).then(async () => {
					sceneStore.onHolisticResult(poseWorker)
				})
			},
			config.holisticComplexity ?? 1
		)
	}
	return { startHolistic }
}
