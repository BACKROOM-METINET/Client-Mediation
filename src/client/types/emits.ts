import type { Auth, Room } from '@/client/types/business'

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

export interface createAndJoinRoomEmit extends Emit {
	event: '@createAndJoinRoom'
	payload: {
		username: string
		roomName: string
	}
	response: {
		room: Room
	}
}

export interface joinRoomEmit extends Emit {
	event: '@joinRoom'
	payload: {
		username: string
		roomId: string
	}
	response: {
		room: Room
	}
}

export interface leaveRoomEmit extends Emit {
	event: '@leaveRoom'
	payload: {
		username: string
		roomId: string
	}
	response: {
		room: Room
	}
}
