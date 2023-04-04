import {
	type StandardMaterial,
	Vector3,
	type Mesh,
	MeshBuilder,
	SceneLoader,
	AbstractMesh,
} from '@babylonjs/core'
import type { ChairConfig, Scene } from '@/client/types/business'
import { MeshRoomEnum, type MeshRoomList } from '@/client/types/meshes'
import { radToDeg } from '@/client/utils/converter'
import { getMaterial } from './materials'

// Helpers
const materials = getMaterial()

const MESHES_REPOSITORY = '../../assets/meshes/'

const MESH_ROOM: MeshRoomList = {
	PROTOTYPE_01: {
		name: 'meeting-room-v2.obj',
		funct: (meshes: AbstractMesh[], scene: Scene) => {
			console.log(meshes)
			meshes.forEach((meshe) => {
				meshe.position = new Vector3(-100, -1, 100)
				meshe.scaling.scaleInPlace(10)
				if (meshe.name === 'Floor') meshe.material = materials.woodDark(scene)
			})
		},
	},
	PROTOTYPE_02: {
		name: 'prototype-2-texture&door.gltf',
		funct: (meshes: AbstractMesh[]) => {
			meshes.forEach((meshe) => {
				if (meshe.name !== '__root__') return
				meshe.position.x += 15
				meshe.position.y += -0.5
				meshe.position.z += 15
			})
		},
	},
	PROTOTYPE_02_NOTEXTURE: {
		name: 'prototype-2-notexture&door.gltf',
		funct: (meshes: AbstractMesh[]) => {
			meshes.forEach((meshe) => {
				if (meshe.name !== '__root__') return
				meshe.position.x += 15
				meshe.position.y += -0.5
				meshe.position.z += 15
			})
		},
	},
}

export function getMesh() {
	const tableMediation = (
		scene: Scene,
		texture: StandardMaterial,
		numberOfPeople: number
	): number => {
		const size = 1
		let tableSize = 6

		if (numberOfPeople > 4) {
			tableSize += (numberOfPeople - 4) * 2
		}

		const tableTopOrigin = new Vector3(0, 2.6, 0)
		const tableTop: Mesh = MeshBuilder.CreateCylinder(
			'tableTop',
			{ diameter: tableSize, height: 0.2 },
			scene
		)

		const tableLegOrigin = new Vector3(0, 1.3, 0)
		const tableLeg: Mesh = MeshBuilder.CreateCylinder(
			'tableLeg',
			{ diameter: 0.5 * size, height: 2.5 },
			scene
		)

		const tableBottomOrigin = new Vector3(0, 0.05, 0)
		const tableBottom: Mesh = MeshBuilder.CreateCylinder(
			'tableBottom',
			{ diameter: 2.5 * size, height: 0.1 },
			scene
		)

		tableTop.material = texture
		tableTop.position = tableTopOrigin

		//tableLeg.material = texture;
		tableLeg.position = tableLegOrigin

		//tableBottom.material = texture;
		tableBottom.position = tableBottomOrigin

		return tableSize / 2
	}

	return {
		tableMediation,
	}
}

export function loadMesh() {
	const mediationRoom = (
		scene: Scene,
		meshRoom: MeshRoomEnum = MeshRoomEnum.PROTOTYPE_01
	) => {
		SceneLoader.ImportMesh(
			'',
			MESHES_REPOSITORY,
			MESH_ROOM[meshRoom].name,
			scene,
			(meshes) => MESH_ROOM[meshRoom].funct(meshes, scene)
		)
	}

	const chairAroundTable = (scene: Scene, config: ChairConfig) => {
		SceneLoader.ImportMesh(
			'',
			MESHES_REPOSITORY,
			'chair.obj',
			scene,
			(meshes) => {
				meshes.forEach((meshe) => {
					meshe.scaling.scaleInPlace(3.6)
					meshe.position = new Vector3(
						config.tableRayon *
							Math.cos(radToDeg((360 / config.membersNumber) * config.order)),
						0,
						config.tableRayon *
							Math.sin(radToDeg((360 / config.membersNumber) * config.order))
					)
					meshe.rotation = new Vector3(
						0,
						radToDeg((-360 / config.membersNumber) * config.order),
						0
					)
					if (meshe.name === 'leather_Cube.002')
						meshe.material = materials.tissue(scene)
					if (meshe.name === 'metal_frame_Plane.001')
						meshe.material = materials.metal(scene)
					/*
				bottom_frame_Cube
				NewUI.vue:174 mesh_mm1
				NewUI.vue:174 leather_Cube.002
				NewUI.vue:174 leggy_Cylinder.013
				NewUI.vue:174 mesh_mm1
				NewUI.vue:174 metal_frame_Plane.001 
				*/

					//meshe.material = woodTexture;
				})
			}
		)
	}
	return {
		mediationRoom,
		chairAroundTable,
	}
}
