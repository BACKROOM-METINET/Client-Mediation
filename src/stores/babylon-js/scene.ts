import {
	Engine,
	FreeCamera,
	Scene,
	Vector3,
	type Engine as EngineType,
	type Scene as SceneType,
} from '@babylonjs/core'
import type * as Comlink from 'comlink'
import { defineStore } from 'pinia'
import { ref, computed, toRefs, type Ref } from 'vue'
import { getMaterial } from '@/client/helpers/materials'
import { getMesh, loadMesh } from '@/client/helpers/mesh'
import { loadSkybox } from '@/client/helpers/skybox'
import type { Avatar } from '@/client/types/business'
import type { MediationConfig } from '@/client/types/config'
import type { SkyboxEnum } from '@/client/types/meshes'
import { coordinateToVector3 } from '@/client/utils/converter'
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
	const engine: Ref<EngineType | null> = ref(null)
	const scene: Ref<SceneType | null> = ref(null)
	const avatar: Ref<Avatar | null> = ref(null)

	const membersNumber: Ref<number> = ref(6)

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

	function setSkybox(skybox: SkyboxEnum) {
		if (!scene.value) return
		const index = scene.value.meshes.findIndex(
			(mesh) => mesh.name === 'skybox_mesh'
		)
		const index2 = scene.value.lights.findIndex(
			(mesh) => mesh.name === 'light_skybox'
		)
		if (index === -1 || index2 === -1) return
		scene.value.meshes.splice(index, 1)
		scene.value.lights.splice(index2, 1)
		loadSkybox(scene.value, skybox)
	}

	async function render(
		canvas: HTMLCanvasElement,
		remote: Comlink.Remote<Pose>,
		config: MediationConfig
	) {
		engine.value = new Engine(canvas, true)

		const createScene = async () => {
			scene.value = new Scene(engine.value as EngineType)

			// const axes = new AxesViewer(scene.value as Scene, 20)

			loadSkybox(scene.value, config.skybox)

			const cameraData = await remote.camera
			// Camera
			cameraStore.setCamera(
				new FreeCamera(
					'camera1',
					coordinateToVector3(cameraData.position),
					scene.value
				)
			)
			if (!cameraRef.value) return
			cameraRef.value.setTarget(Vector3.Zero())
			cameraRef.value.attachControl(canvas, true)
			// Avatar
			// avatar.value = {
			// 	hands: {
			// 		right: new Hand(
			// 			'rightHandRef',
			// 			sceneRef.value as Scene,
			// 			{
			// 				x: cameraRef.value.position.x + 3,
			// 				y: cameraRef.value.position.y - 3,
			// 				z: -3,
			// 			},
			// 			materials.materialRed(sceneRef.value as Scene)
			// 		),
			// 		left: new Hand(
			// 			'leftHandRef',
			// 			sceneRef.value as Scene,
			// 			{
			// 				x: cameraRef.value.position.x - 3,
			// 				y: cameraRef.value.position.y - 3,
			// 				z: -3,
			// 			},
			// 			materials.materialBlue(sceneRef.value as Scene)
			// 		),
			// 	},
			// }

			// Import Meshes
			meshesLoader.mediationRoom(sceneRef.value as Scene, config.scene)

			const tableRayon = createTable(membersNumber.value)

			for (let i = 0; i < membersNumber.value; i++) {
				meshesLoader.chairAroundTable(sceneRef.value as Scene, {
					order: i,
					membersNumber: membersNumber.value,
					tableRayon: tableRayon,
				})
			}

			setTimeout(async() => {
				await meshesLoader.character(scene.value as Scene)
			}, 10000 );


			return sceneRef.value
		}
		const sceneToRender = await createScene()
		engine.value?.runRenderLoop(() => {
			sceneToRender?.render()
		})
		window.addEventListener('resize', function () {
			engine.value?.resize()
		})
	}

	async function onHolisticResult(remote: Comlink.Remote<Pose>) {
		remote.camera.then((_camera) =>
			cameraStore.setCameraRotation(_camera.rotation.x, _camera.rotation.y)
		)
		// remote.handLeft.then((hand) => avatarRef.value?.hands.left.update(hand))
		// remote.handRight.then((hand) => avatarRef.value?.hands.right.update(hand))
	}

	return {
		sceneRef,
		cameraRef,
		avatarRef,
		membersNumberRef,
		fpsCounter,
		setSkybox,
		render,
		onHolisticResult,
	}
})
