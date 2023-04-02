import type { Complexity } from './business'
import type { MeshRoomEnum } from './meshes'

export interface MediationConfig {
	scene?: keyof typeof MeshRoomEnum
	holisticComplexity?: Complexity
}
