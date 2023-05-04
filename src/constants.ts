export const MEDIATION_BACK_SERVER = 'localhost:3000'
export const MEDIATION_WS_SERVER = 'ws://' + MEDIATION_BACK_SERVER
export const EMOTION_AI_SERVER = 'ws://localhost:8765'

const MIXAMORIG = 'mixamorig:'

export const DUMMY_KEY = {
	MESHES: {
		SKIN: MIXAMORIG + 'Skin',
	},
	BONES: {
		NECK: MIXAMORIG + 'Neck',
		RIGHT_UP_LEG: MIXAMORIG + 'RightUpLeg',
		RIGHT_LEG: MIXAMORIG + 'RightLeg',
		LEFT_UP_LEG: MIXAMORIG + 'LeftUpLeg',
		LEFT_LEG: MIXAMORIG + 'LeftLeg',
	},
}
