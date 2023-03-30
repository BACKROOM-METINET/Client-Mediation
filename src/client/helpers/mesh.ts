import {
	type Scene,
	type StandardMaterial,
	Vector3,
	type Mesh,
	MeshBuilder,
	SceneLoader,
} from '@babylonjs/core'
import type { ChairConfig } from '../types/business'
import { radToDeg } from '../utils/converter'
import { getMaterial } from './materials'

const MESHES_REPOSITORY = '../../assets/meshes/'

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
	// Helpers
	const materials = getMaterial()

	// Getters

	const mediationRoom = (scene: Scene) => {
		SceneLoader.ImportMesh(
			'',
			MESHES_REPOSITORY,
			'meeting-room-v2.obj',
			scene,
			(meshes) => {
				meshes.forEach((meshe) => {
					// Vector3(0,2.6,0);
					meshe.position = new Vector3(-100, -1, 100)
					//meshe.size(2);
					meshe.scaling.scaleInPlace(10)
					if (meshe.name === 'Floor') meshe.material = materials.woodDark(scene)
				})
			}
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
