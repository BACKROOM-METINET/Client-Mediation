import { Color3, HemisphericLight, PhotoDome, Vector3 } from '@babylonjs/core'
import type { Scene } from '@/client/types/business'
import { SkyboxEnum, type SkyboxList } from '@/client/types/meshes'

const skybox: SkyboxList = {
	CLEAR_SKY: {
		funct: (scene: Scene) => {
			// Skybox
			const _dome = new PhotoDome(
				'skybox',
				'assets/skyboxes/clear_sky.png',
				{
					resolution: 32,
					size: 1000,
				},
				scene
			)

			// Light
			const light = new HemisphericLight(
				'light_skybox',
				new Vector3(-30, 15, 40),
				scene
			)
			light.intensity = 1
		},
	},
	CLEAR_SKY_GROUND: {
		funct: (scene: Scene) => {
			// Skybox
			const _dome = new PhotoDome(
				'skybox',
				'assets/skyboxes/clear_sky_ground.png',
				{
					resolution: 64,
					size: 2000,
				},
				scene
			)

			// Light
			const light = new HemisphericLight(
				'light_skybox',
				new Vector3(-30, 15, 40),
				scene
			)
			light.intensity = 1
		},
	},
	MOUNTAIN: {
		funct: (scene: Scene) => {
			// Skybox
			const _dome = new PhotoDome(
				'skybox',
				'assets/skyboxes/mountain.png',
				{
					resolution: 32,
					size: 1000,
				},
				scene
			)

			// Light
			const light = new HemisphericLight(
				'light_skybox',
				new Vector3(-55, 12, 40),
				scene
			)
			light.intensity = 0.3
			// light.diffuse = new Color3(255, 255, 0)
			light.specular = new Color3(150, 100, 25)
			// light.groundColor = new Color3(255, 255, 0)
		},
	},
}

export function loadSkybox(
	scene: Scene,
	skyboxEnum: SkyboxEnum = SkyboxEnum.CLEAR_SKY
) {
	skybox[skyboxEnum].funct(scene)
}
