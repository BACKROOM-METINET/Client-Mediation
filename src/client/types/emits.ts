import type { Auth, AvatarEventInput, Room } from '@/client/types/business'

export interface Emit {
	event: string
	authenticated: boolean
	payload: object
	response: object
}

export interface AuthenticateEmit extends Emit {
	event: '@authenticate'
	authenticated: false
	payload: {
		username: string
	}
	response: Auth
}

export interface GetRoomsEmit extends Emit {
	event: '@getRooms'
	payload: {}
	response: {
		rooms: Room[]
	}
}

export interface CreateRoomEmit extends Emit {
	event: '@createRoom'
	payload: {
		username: string
		roomName: string
	}
	response: {
		room: Room
	}
}

export interface JoinRoomEmit extends Emit {
	event: '@joinRoom'
	payload: {
		username: string
		roomId: number
	}
	response: {
		room: Room
	}
}

export interface LeaveRoomEmit extends Emit {
	event: '@leaveRoom'
	payload: {
		username: string
		roomId: number
	}
	response: {
		room: Room
	}
}

export interface SendAvatarDataEmit extends Emit {
	event: '@sendAvatarData'
	payload: {
		username: string
		roomId: number
		avatar: AvatarEventInput
	}
	response: {
		room: Room
	}
}
