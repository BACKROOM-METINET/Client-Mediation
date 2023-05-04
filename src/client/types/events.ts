import type { AvatarEventInput, ParticipantServer, Room } from './business'

export interface Event {
	event: string
	payload: unknown
}

export interface RoomCreatedEvent extends Event {
	event: '@RoomCreated'
	payload: {
		room: Room
	}
}

export interface RoomDeletedEvent extends Event {
	event: '@RoomDeleted'
	payload: {
		roomId: number
	}
}

export interface ParticipantAddedEvent extends Event {
	event: '@ParticipantAdded'
	payload: {
		roomId: number
		participant: ParticipantServer
	}
}

export interface ParticipantRemovedEvent extends Event {
	event: '@ParticipantRemoved'
	payload: {
		roomId: number
		username: string
	}
}

export interface AvatarDataEvent extends Event {
	event: '@AvatarData'
	payload: {
		roomId: number
		username: string
		data: AvatarEventInput
	}
}

export interface MediationStartedEvent extends Event {
	event: '@MediationStarted'
	payload: {
		room: Room
		mediator: string
	}
}
