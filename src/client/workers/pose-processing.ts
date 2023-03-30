import type { Nullable } from '@babylonjs/core'
import type { NormalizedLandmark } from '@mediapipe/holistic'
import * as Comlink from 'comlink'
import type { CloneableResults } from '@/client/types/business'

// const sceneStore = useSceneStore()
interface CameraRotation {
	x: number
	y: number
}

function calculRotateX(
	c0: NormalizedLandmark,
	c7: NormalizedLandmark,
	c8: NormalizedLandmark
) {
	const perc = ((c0.x - c8.x) * 100) / (c7.x - c8.x)
	return (perc - 50) / -100
}

function calculRotateY(
	c1: NormalizedLandmark,
	c4: NormalizedLandmark,
	c7: NormalizedLandmark,
	c8: NormalizedLandmark
) {
	const center1 = { x: (c4.x + c1.x) / 2, y: (c4.y + c1.y) / 2 }
	const center2 = { x: (c8.x + c7.x) / 2, y: (c8.y + c7.y) / 2 }
	return (center1.y - center2.y + 0.02) * 10
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
		this.cameraRotation.y = calculRotateX(coords[0], coords[7], coords[8])
		this.cameraRotation.x = calculRotateY(
			coords[1],
			coords[4],
			coords[7],
			coords[8]
		)
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
