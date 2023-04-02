import type { AbstractMesh } from '@babylonjs/core'
import type { Scene } from './business'

export interface MeshRoom {
	name: string
	funct: (meshes: AbstractMesh[], scene: Scene) => void
}

export interface MeshRoomList {
	PROTOTYPE_01: MeshRoom
	PROTOTYPE_02: MeshRoom
	PROTOTYPE_02_NOTEXTURE: MeshRoom
}

export enum MeshRoomEnum {
	PROTOTYPE_01 = 'PROTOTYPE_01',
	PROTOTYPE_02 = 'PROTOTYPE_02',
	PROTOTYPE_02_NOTEXTURE = 'PROTOTYPE_02_NOTEXTURE',
}
