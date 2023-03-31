import type { Nullable } from '@babylonjs/core'
import type { NormalizedLandmarkList } from '@mediapipe/holistic'
import * as Comlink from 'comlink'
import type { CloneableResults } from '@/client/types/business'

// const sceneStore = useSceneStore()
interface CameraRotation {
	x: number
	y: number
}

function calculRotateY(coords: NormalizedLandmarkList) {
	return (
		(((coords[0].x - coords[8].x) * 100) / (coords[7].x - coords[8].x) - 50) /
		-100
	)
}

function calculRotateX(coords: NormalizedLandmarkList) {
	return (
		((coords[4].y + coords[1].y) / 2 - (coords[8].y + coords[7].y) / 2 + 0.02) *
		10
	)
}

export class Pose {
	public cloneableInputResults: Nullable<CloneableResults> = null
	public cameraRotation!: CameraRotation
	constructor() {
		this.cameraRotation = {
			x: 0,
			y: 0,
		}
	}
	private updateCamera(results: CloneableResults) {
		if (!results?.poseLandmarks) return
		const coords = results.poseLandmarks
		this.cameraRotation.y = calculRotateY(coords)
		this.cameraRotation.x = calculRotateX(coords)
	}
	public process(results: CloneableResults) {
		this.cloneableInputResults = results
		if (!this.cloneableInputResults) return
		this.updateCamera(results)
		// sceneStore.onHolisticResult(results)
	}
}

export const poseWrapper = {
	pose: Pose,
}
Comlink.expose(poseWrapper)
