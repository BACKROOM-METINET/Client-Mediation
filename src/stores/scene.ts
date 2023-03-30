import {
	Engine,
	FreeCamera,
	HemisphericLight,
	Scene,
	Vector3,
	type Engine as EngineType,
	type Scene as SceneType,
} from '@babylonjs/core'
import type { Results } from '@mediapipe/holistic'
import type * as Comlink from 'comlink'
import { defineStore } from 'pinia'
import { ref, computed, toRefs } from 'vue'
import { Hand } from '@/client/class/hands'
import { getMaterial } from '@/client/helpers/materials'
import { getMesh, loadMesh } from '@/client/helpers/mesh'
import type { Avatar } from '@/client/types/business'
import type { Pose } from '@/client/workers/pose-processing'
import { useCameraStore } from './camera'

export const useSceneStore = defineStore('scene', () => {
	// Stores
	const cameraStore = useCameraStore()
	const { cameraRef } = toRefs(cameraStore)

	// Helpers
	const materials = getMaterial()
	const meshes = getMesh()
	const meshesLoader = loadMesh()

	// States
	const engine = ref<EngineType | null>(null)
	const scene = ref<SceneType | null>(null)
	const avatar = ref<Avatar | null>(null)

	const membersNumber = ref<number>(6)

	// Getters

	const sceneRef = computed(() => scene.value)
	const avatarRef = computed(() => avatar.value)

	const membersNumberRef = computed(() => scene.value)
	const fpsCounter = computed(() => Math.round(engine.value?.getFps() ?? 0))

	// Actions

	function createTable(peopleNumber: number) {
		return meshes.tableMediation(
			scene.value as SceneType,
			materials.woodNatural(scene.value as SceneType),
			peopleNumber
		)
	}

	function render(canvas: HTMLCanvasElement, remote: Comlink.Remote<Pose>) {
		engine.value = new Engine(canvas, true)

		const createScene = function () {
			scene.value = new Scene(engine.value as EngineType)

			// Camera
			cameraStore.setCamera(
				new FreeCamera(
					'camera1',
					new Vector3(0, 5, -10),
					sceneRef.value as Scene
				)
			)
			if (!cameraRef.value) return
			cameraRef.value.setTarget(Vector3.Zero())
			cameraRef.value.attachControl(canvas, true)

			// Light
			const light = new HemisphericLight(
				'light',
				new Vector3(0, 1, 0),
				scene.value as Scene
			)
			light.intensity = 0.7

			// Avatar
			avatar.value = {
				hands: {
					right: new Hand(
						'rightHandRef',
						sceneRef.value as Scene,
						{
							x: cameraRef.value.position.x + 3,
							y: cameraRef.value.position.y - 3,
							z: -3,
						},
						materials.materialRed(sceneRef.value as Scene)
					),
					left: new Hand(
						'leftHandRef',
						sceneRef.value as Scene,
						{
							x: cameraRef.value.position.x - 3,
							y: cameraRef.value.position.y - 3,
							z: -3,
						},
						materials.materialBlue(sceneRef.value as Scene)
					),
				},
			}

			// Import Meshes
			meshesLoader.mediationRoom(sceneRef.value as Scene)

			const tableRayon = createTable(membersNumber.value)

			for (let i = 0; i < membersNumber.value; i++) {
				meshesLoader.chairAroundTable(sceneRef.value as Scene, {
					order: i,
					membersNumber: membersNumber.value,
					tableRayon: tableRayon,
				})
			}

			return sceneRef.value
		}
		const sceneToRender = createScene()
		engine.value?.runRenderLoop(async () => {
			const cameraRotation = await remote.cameraRotation
			if (cameraRef.value) {
				cameraRef.value.rotation.x = cameraRotation.x
				cameraRef.value.rotation.y = cameraRotation.y
			}
			sceneToRender?.render()
		})
		window.addEventListener('resize', function () {
			engine.value?.resize()
		})
	}

	function onHolisticResult(results: Results) {
		// if (cameraRef.value) {
		// 	if (results.leftHandLandmarks) {
		// 		avatarRef.value?.hands.left.updateEvent(
		// 			cameraRef.value as Camera,
		// 			results.leftHandLandmarks
		// 		)
		// 	}
		// 	if (results.rightHandLandmarks) {
		// 		avatarRef.value?.hands.right.updateEvent(
		// 			cameraRef.value as Camera,
		// 			results.rightHandLandmarks
		// 		)
		// 	}
		// }
	}

	return {
		sceneRef,
		cameraRef,
		avatarRef,
		membersNumberRef,
		fpsCounter,
		render,
		onHolisticResult,
	}
})
