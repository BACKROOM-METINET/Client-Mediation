import type { Results } from '@mediapipe/holistic'
import * as Comlink from 'comlink'
import { type Ref, toRefs } from 'vue'
import { useCameraStore } from '@/stores/camera'
import { useSceneStore } from '@/stores/scene'
import { useHolisticService } from '../services/holistic'
import type { Camera } from '../types/business'

export class Pose {
	public async onHolisticResult(results: Results, cameraRef: Ref<Camera>) {
		const camera = useCameraStore()
		const scene = useSceneStore()
		const { avatarRef } = toRefs(scene)
		if (results.poseLandmarks) {
			camera.onHolisticResult(results.poseLandmarks)
		}
		if (cameraRef.value) {
			if (results.leftHandLandmarks) {
				avatarRef.value?.hands.left.updateEvent(
					cameraRef.value,
					results.leftHandLandmarks
				)
			}
			if (results.rightHandLandmarks) {
				avatarRef.value?.hands.right.updateEvent(
					cameraRef.value,
					results.rightHandLandmarks
				)
			}
		}
	}
}

const holisticService = useHolisticService()

export const poseWrapper = {
	poses: Pose,
	holisticService,
}
Comlink.expose(poseWrapper)
