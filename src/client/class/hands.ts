import EventEmitter from 'events'
import * as BABYLON from '@babylonjs/core'
import type {
	AvatarHand,
	Scene,
	Mesh,
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
		// this.initEvents()
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
		this.mesh.fingersPoints.forEach((point, index) => {
			if (!hand.points[index]) return
			this.updatePoint(point, hand.points[index])
		})
	}
}
