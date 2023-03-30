import '@babylonjs/core/Debug/debugLayer'

import '@babylonjs/loaders/glTF'
import 'babylonjs-loaders'
import '@babylonjs/loaders/OBJ/objFileLoader'

import * as Comlink from 'comlink'
import { ref, toRefs, type Ref } from 'vue'
import { useSceneStore } from '@/stores/scene'
import { useSettingStore } from '@/stores/setting'
import type { Avatar } from './types/business'

export async function mediation(
	videoSource: HTMLVideoElement,
	outputCanvas: HTMLCanvasElement,
	babylonCanvas: HTMLCanvasElement,
	_config?: any
) {
	// Stores
	const settings = useSettingStore()
	const scene = useSceneStore()
	const { holisticComplexity } = toRefs(settings)
	const { avatarRef, cameraRef } = toRefs(scene)

	// Variables
	const canvasCtx = outputCanvas.getContext('2d') as CanvasRenderingContext2D
	const isLoading = ref<boolean>(true)
	// const isCameraActive = ref(true)
	// const isMediapipeViewActive = ref(true)
	// const isSettingMenuOpen = ref(false)

	scene.render(babylonCanvas)

	const worker = Comlink.wrap<any>(
		new Worker(new URL('./workers/pose-processing.ts', import.meta.url)),
		{ type: 'module' }
	)
	const pose = new worker.pose()
	pose.then((v: any) => v.setAvatarRef(avatarRef as Ref<Avatar>))
	function startHolistic() {
		// worker.holisticService.holistic(
		// 	videoSource,
		// 	async (results: Results) => {
		// 		isLoading.value = false
		// 		worker.pose.onHolisticResult(results, cameraRef)
		// 		worker.holisticService.onResults(results, outputCanvas, canvasCtx)
		// 	},
		// 	holisticComplexity.value
		// )
	}
	return { startHolistic }
}
