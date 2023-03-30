import type * as BABYLON from '@babylonjs/core'
import type { Hand } from '../class/hands'
import type { Results } from '@mediapipe/holistic'
export interface Coordinate {
	x: number
	y: number
	z: number
	visibility?: number
}

export interface MediapipeResult {
	faceLandmarks: Coordinate[]
	image: ImageBitmap
	leftHandLandmarks: Coordinate[]
	multiFaceGeometry: []
	poseLandmarks: Coordinate[]
	rightHandLandmarks: Coordinate[]
	segmentationMask: ImageBitmap
	za: Coordinate[]
}

export interface CloneableResults
	extends Omit<Results, 'segmentationMask' | 'image'> {}

export interface AvatarHand {
	origin: BABYLON.Mesh
	fingersPoints: BABYLON.Mesh[]
}

export interface Avatar {
	hands: {
		right: Hand
		left: Hand
	}
}

export type Scene = BABYLON.Scene
export type Camera = BABYLON.FreeCamera
export type Mesh = BABYLON.Mesh
export type Material = BABYLON.StandardMaterial

export type Complexity = 0 | 1 | 2

export interface ChairConfig {
	tableRayon: number
	membersNumber: number
	order: number
}
