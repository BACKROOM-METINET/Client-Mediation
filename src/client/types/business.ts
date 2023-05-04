import type * as BABYLON from '@babylonjs/core'
import type { GpuBuffer, Results } from '@mediapipe/holistic'
import type { Hand } from '@/client/class/hands'
import type { MeshRoomEnum, SkyboxEnum } from './meshes'
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

export type Emotion = 'Angry' | 'Happy' | 'Neutral' | 'Sad' | 'Surprise'

export interface ChairConfig {
	tableRayon: number
	membersNumber: number
	order: number
}

export interface AvatarConfig extends ChairConfig {
	isMe: boolean
}

export interface CameraData {
	position: Coordinate
	rotation: Coordinate
}

export interface HandPosition {
	origin: Coordinate
	points: Coordinate[]
}

export interface HeadData {
	rotation: Coordinate
}

export interface AvatarData {
	head: HeadData
	hands: {
		right: HandPosition
		left: HandPosition
	}
}

export interface AvatarEventInput extends AvatarData {
	emotion: Emotion
}

export type Role = 'mediator' | 'lawyer' | 'user'

export type RoomState = 'waiting' | 'mediation' | 'finish'

export interface ParticipantEvent {
	name: string
	role: Role
	emotion: Emotion
}

export interface ParticipantServer extends Omit<ParticipantEvent, 'emotion'> {}

export interface Participant extends ParticipantEvent {
	isMe: boolean
	avatar?: AvatarData
}

export interface RoomConfig {
	skybox_asset?: keyof typeof SkyboxEnum
	room_asset?: keyof typeof MeshRoomEnum
}

export interface Room {
	id: number
	name: string
	state: RoomState
	config?: RoomConfig
	participants: Participant[]
}

export interface Auth {
	name: string
}

export interface User {
	name: string
}

export interface VisioLog {
	id: number
	message: string
}
