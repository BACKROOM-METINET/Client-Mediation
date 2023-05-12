import type { Nullable } from '@babylonjs/core'
import type { NormalizedLandmarkList } from '@mediapipe/holistic'
import * as Comlink from 'comlink'
import { Face } from 'kalidokit'
import type {
	AvatarData,
	CameraData,
	CloneableResults,
	Coordinate,
	HandPosition,
} from '@/client/types/business'

const SENSIBILITY = 5

export class Pose {
	public cloneableInputResults: Nullable<CloneableResults> = null
	public camera: CameraData
	public handLeft: HandPosition
	public handRight: HandPosition

	/**
	 * Reduce Camera Shaking
	 */

	private historyCamX: number[] = []
	private historyCamY: number[] = []

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
	private getAvatarData(): AvatarData {
		return {
			head: {
				rotation: this.camera.rotation,
			},
			hands: {
				right: this.handRight,
				left: this.handLeft,
			},
		}
	}
	private camPositionAverage(newNum: number, history: number[]): number {
		if (history.length >= SENSIBILITY) history.shift()
		history.push(newNum)
		return history.reduce((a, b) => a + b, newNum) / history.length
	}
	private updateCamera(results: CloneableResults) {
		if (!results?.faceLandmarks) return
		const rig = Face.solve(results.faceLandmarks, {
			runtime: 'mediapipe',
		})
		const x = (rig?.head.x ?? 0) * -1 - 0.1
		const y = rig?.head.y ?? 0
		this.camera.rotation = {
			x: this.camPositionAverage(x, this.historyCamX),
			y: this.camPositionAverage(y, this.historyCamY),
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
	public process(results: CloneableResults): AvatarData | null {
		this.cloneableInputResults = results
		if (!this.cloneableInputResults) return null
		this.updateCamera(this.cloneableInputResults)
		this.updateHandLeft(this.cloneableInputResults, this.handLeft)
		this.updateHandRight(this.cloneableInputResults, this.handRight)
		return this.getAvatarData()
	}
}

export const poseWrapper = {
	pose: Pose,
}
Comlink.expose(poseWrapper)
