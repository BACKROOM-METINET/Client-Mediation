import type * as BABYLON from '@babylonjs/core'
import type { GpuBuffer, Results } from '@mediapipe/holistic'
import type { Hand } from '@/client/class/hands'
export interface Coordinate {
	x: number
	y: number
	z: number
}

export interface CloneablePreResults
	extends Omit<Results, 'segmentationMask' | 'image'> {
	image?: GpuBuffer
}

export interface CloneableResults extends Omit<CloneablePreResults, 'image'> {}

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

export interface CameraData {
	position: Coordinate
	rotation: Coordinate
}

export interface HandPosition {
	origin: Coordinate
	points: Coordinate[]
}

export type Expression = 'Angry' | 'Happy' | 'Neutral' | 'Sad' | 'Surprise'
