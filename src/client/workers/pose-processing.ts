import type { Nullable } from '@babylonjs/core'
import type { NormalizedLandmarkList } from '@mediapipe/holistic'
import * as Comlink from 'comlink'
import type {
	CameraData,
	CloneableResults,
	Coordinate,
	HandPosition,
} from '@/client/types/business'

const BASE_COORDINATE = { x: 0, y: 0, z: 0 }
const BASE_CAMERA_POSITION = { x: 0, y: 5, z: -10 }
const BASE_HAND = {
	origin: BASE_COORDINATE,
	points: [],
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
	public camera: CameraData
	public handLeft: HandPosition
	public handRight: HandPosition
	constructor() {
		this.camera = {
			position: BASE_CAMERA_POSITION,
			rotation: BASE_COORDINATE,
		}
		this.handLeft = BASE_HAND
		this.handRight = BASE_HAND
	}
	get cameraRotation() {
		return {
			x: this.camera.rotation.x,
			y: this.camera.rotation.y,
		}
	}
	private updateCamera(results: CloneableResults) {
		if (!results?.poseLandmarks) return
		const coords = results.poseLandmarks
		this.camera.rotation.y = calculRotateY(coords)
		this.camera.rotation.x = calculRotateX(coords)
		console.log('[worker] : ', this.camera.rotation.x)
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
		hand.origin.x = this.camera.position.x + (10 - origin.x * 10 - 5)
		hand.origin.y = this.camera.position.y - 5 + (10 - origin.y * 10)
		hand.origin.z = this.camera.position.z + 8
	}
	private async updateHandPoint(
		coord: Coordinate,
		hand: HandPosition,
		index: number
	) {
		if (!hand.points[index]) hand.points[index] = BASE_COORDINATE
		hand.points[index].x = this.camera.position.x + (10 - coord.x * 10 - 5)
		hand.points[index].y = this.camera.position.y - 5 + (10 - coord.y * 10)
		hand.points[index].z = hand.origin.z - coord.z * 30
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
		this.updateCamera(results)
		this.updateHandLeft(results, this.handLeft)
		this.updateHandRight(results, this.handRight)
		// sceneStore.onHolisticResult(results)
	}
}

export const poseWrapper = {
	pose: Pose,
}
Comlink.expose(poseWrapper)
