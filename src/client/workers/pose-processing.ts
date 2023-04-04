import type { Nullable } from '@babylonjs/core'
import type { NormalizedLandmarkList } from '@mediapipe/holistic'
import * as Comlink from 'comlink'
import type {
	CameraData,
	CloneableResults,
	Coordinate,
	HandPosition,
} from '@/client/types/business'

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
	public camera: CameraData
	public handLeft: HandPosition
	public handRight: HandPosition
	constructor() {
		this.camera = {
			position: { x: 0, y: 5, z: -10 },
			rotation: { x: 0, y: 0, z: 0 },
		}
		this.handLeft = {
			origin: { x: 0, y: 0, z: 0 },
			points: [],
		}
		this.handRight = {
			origin: { x: 0, y: 0, z: 0 },
			points: [],
		}
	}
	private updateCamera(results: CloneableResults) {
		if (!results?.poseLandmarks) return
		const coords = results.poseLandmarks
		this.camera.rotation = {
			x: calculRotateX(coords),
			y: calculRotateY(coords),
			z: 0,
		}
	}
	private updateHandOrigin(coords: NormalizedLandmarkList, hand: HandPosition) {
		const c913 = {
			x: (coords[9].x + coords[13].x) / 2,
			y: (coords[9].y + coords[13].y) / 2,
		}
		const origin = {
			x: (c913.x + coords[0].x) / 2,
			y: (c913.y + coords[0].y) / 2,
		}
		hand.origin = {
			x: this.camera.position.x + (10 - origin.x * 10 - 5),
			y: this.camera.position.y - 5 + (10 - origin.y * 10),
			z: this.camera.position.z + 8,
		}
	}
	private async updateHandPoint(
		coord: Coordinate,
		hand: HandPosition,
		index: number
	) {
		if (!hand.points[index]) hand.points[index] = { x: 0, y: 0, z: 0 }
		hand.points[index] = {
			x: this.camera.position.x + (10 - coord.x * 10 - 5),
			y: this.camera.position.y - 5 + (10 - coord.y * 10),
			z: hand.origin.z - coord.z * 30,
		}
	}
	private updateHandLeft(results: CloneableResults, hand: HandPosition) {
		if (!results?.leftHandLandmarks) return
		const coordsleftHand = results.leftHandLandmarks
		this.updateHandOrigin(coordsleftHand, hand)
		coordsleftHand.forEach((landmark, index) =>
			this.updateHandPoint(landmark, hand, index)
		)
	}
	private updateHandRight(results: CloneableResults, hand: HandPosition) {
		if (!results?.rightHandLandmarks) return
		const coordsRightHand = results.rightHandLandmarks
		this.updateHandOrigin(coordsRightHand, hand)
		coordsRightHand.forEach((landmark, index) =>
			this.updateHandPoint(landmark, hand, index)
		)
	}
	public process(results: CloneableResults) {
		this.cloneableInputResults = results
		if (!this.cloneableInputResults) return
		this.updateCamera(this.cloneableInputResults)
		this.updateHandLeft(this.cloneableInputResults, this.handLeft)
		this.updateHandRight(this.cloneableInputResults, this.handRight)
	}
}

export const poseWrapper = {
	pose: Pose,
}
Comlink.expose(poseWrapper)
