import { Color3, Scene, StandardMaterial, Texture } from '@babylonjs/core'

const TEXTURE_PREFIX = 'texture-'
const TEXTURE_REPOSITORY = '../../assets/textures/'
const textureName = (name: string) => TEXTURE_PREFIX + name
const textureSource = (fileName: string) => TEXTURE_REPOSITORY + fileName

function genericMaterial(
	scene: Scene,
	name: string,
	source: string
): StandardMaterial {
	const material = new StandardMaterial(textureName(name), scene)
	material.diffuseTexture = new Texture(source, scene)
	material.specularTexture = new Texture(source, scene)
	material.emissiveTexture = new Texture(source, scene)
	material.ambientTexture = new Texture(source, scene)

	return material
}

export function getMaterial() {
	const woodNatural = (scene: Scene): StandardMaterial =>
		genericMaterial(
			scene,
			'wood-natural',
			textureSource('fond-bois-naturel.jpg')
		)

	const woodDark = (scene: Scene): StandardMaterial =>
		genericMaterial(scene, 'wood-dark', textureSource('wood-dark.jpg'))

	const marble = (scene: Scene): StandardMaterial =>
		genericMaterial(scene, 'marble-1', textureSource('marble-1.jpg'))

	const tissue = (scene: Scene): StandardMaterial =>
		genericMaterial(scene, 'tissue', textureSource('tissue.jpg'))

	const metal = (scene: Scene): StandardMaterial =>
		genericMaterial(scene, 'metal-1', textureSource('metal-1.png'))

	const materialRed = (scene: Scene): StandardMaterial => {
		const redMat = new StandardMaterial(textureName('redMat'), scene)
		redMat.emissiveColor = new Color3(1, 0, 0)
		return redMat
	}
	const materialBlue = (scene: Scene): StandardMaterial => {
		const blueMat = new StandardMaterial(textureName('blueMat'), scene)
		blueMat.emissiveColor = new Color3(0, 0, 1)
		return blueMat
	}

	return {
		woodNatural,
		woodDark,
		marble,
		tissue,
		metal,
		materialRed,
		materialBlue,
	}
}
