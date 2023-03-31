import EventEmitter from 'events'
import * as BABYLON from '@babylonjs/core'
import type { NormalizedLandmarkList } from '@mediapipe/holistic'
import type {
	AvatarHand,
	Scene,
	Mesh,
	Camera,
	Coordinate,
	Material,
	HandPosition,
} from '@/client/types/business'

const ORIGIN_DIAMETER = 1
const POINT_DIAMETER = 0.2
const POINT_COUNTER = 21

export class Hand extends EventEmitter {
	name!: string
	scene!: Scene
	mesh!: AvatarHand

	private cameraDistance: number = 7

	constructor(
		name: string,
		scene: Scene,
		coord: Coordinate,
		material?: Material
	) {
		super()
		this.name = name
		this.scene = scene
		this.mesh = {
			origin: this.createOrigin(),
			fingersPoints: this.createFingerPoint(),
		}
		this.mesh.origin.position.x = coord.x
		this.mesh.origin.position.y = coord.y
		this.mesh.origin.position.z = coord.z
		if (material) this.mesh.origin.material = material
		this.initEvents()
	}

	private createOrigin(): Mesh {
		return BABYLON.MeshBuilder.CreateSphere(
			this.name + '_ORIGIN',
			{ diameter: ORIGIN_DIAMETER, segments: 32, updatable: true },
			this.scene
		)
	}

	private createFingerPoint(): Mesh[] {
		const points = []
		for (let i = 0; i < POINT_COUNTER; i++) {
			points.push(
				BABYLON.MeshBuilder.CreateSphere(
					this.name + '_POINT' + i,
					{ diameter: POINT_DIAMETER, segments: 32, updatable: true },
					this.scene
				)
			)
		}
		return points
	}

	private async updatePoint(hand: BABYLON.Mesh, coord: Coordinate) {
		hand.position.x = coord.x
		hand.position.y = coord.y
		hand.position.z = coord.z
	}

	public async update(hand: HandPosition) {
		this.updatePoint(this.mesh.origin, hand.origin)
		this.mesh.fingersPoints.forEach((point, index) =>
			this.updatePoint(point, hand.points[index])
		)
	}

	public async updateHandPoint(
		hand: BABYLON.Mesh,
		camera: BABYLON.Camera,
		coord: {
			x: number
			y: number
			z: number
		}
	) {
		hand.position.x = camera.position.x + (10 - coord.x * 10 - 5)
		hand.position.y = camera.position.y - 5 + (10 - coord.y * 10)
		hand.position.z = coord.z
	}

	public async updateHandOrigin(
		camera: BABYLON.Camera,
		coords: NormalizedLandmarkList
	) {
		try {
			const c913 = {
				x: (coords[9].x + coords[13].x) / 2,
				y: (coords[9].y + coords[13].y) / 2,
			}
			const origin = {
				x: (c913.x + coords[0].x) / 2,
				y: (c913.y + coords[0].y) / 2,
			}
			this.mesh.origin.position.x = camera.position.x + (10 - origin.x * 10 - 5)
			this.mesh.origin.position.y = camera.position.y - 5 + (10 - origin.y * 10)
			this.mesh.origin.position.z = camera.position.z + 8
		} catch (error) {
			console.error('Bad Hand Dectection: ', error)
		}
	}

	public async updateHand(
		camera: Camera,
		coords: NormalizedLandmarkList
	): Promise<void> {
		this.updateHandOrigin(camera, coords)
		this.mesh.fingersPoints.forEach((point, index) =>
			this.updateHandPoint(point, camera, {
				...coords[index],
				z: this.mesh.origin.position.z - coords[index].z * 30,
			})
		)
	}

	private initEvents(): void {
		this.on('@Update', (camera: Camera, coords: NormalizedLandmarkList) =>
			this.updateHand(camera, coords)
		)
	}

	public updateEvent(camera: Camera, coords: NormalizedLandmarkList) {
		this.emit('@Update', camera, coords)
	}
}
