import type { AbstractMesh } from '@babylonjs/core'
import type { Scene } from './business'

export interface MeshRoom {
	name: string
	funct: (meshes: AbstractMesh[], scene: Scene) => void
}

export enum MeshRoomEnum {
	PROTOTYPE_01 = 'PROTOTYPE_01',
	PROTOTYPE_02 = 'PROTOTYPE_02',
	PROTOTYPE_02_NOTEXTURE = 'PROTOTYPE_02_NOTEXTURE',
}

export type MeshRoomList = {
	[key in MeshRoomEnum]: MeshRoom
}

export interface SkyboxChoice {
	funct: (scene: Scene) => void
}

export enum SkyboxEnum {
	CLEAR_SKY = 'CLEAR_SKY',
	CLEAR_SKY_GROUND = 'CLEAR_SKY_GROUND',
	MOUNTAIN = 'MOUNTAIN',
}

export type SkyboxList = {
	[key in SkyboxEnum]: SkyboxChoice
}
