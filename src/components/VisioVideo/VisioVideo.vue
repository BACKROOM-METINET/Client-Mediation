<script setup lang="ts">
import axios from 'axios'
import Twilio, {
	createLocalVideoTrack,
	Room,
	RemoteParticipant,
	RemoteTrackPublication,
	type RemoteTrack,
	RemoteVideoTrack,
} from 'twilio-video'
import { computed, type Ref, ref, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { emitter } from '@/client/events/event'
import { useHighLevelClientEmits } from '@/composables/emits'
import { MEDIATION_BACK_SERVER } from '@/constants'
import { useAuthStore } from '@/stores/auth'
import { useRoomStore } from '@/stores/room'
import { useSettingStore } from '@/stores/setting'

const clientEmits = useHighLevelClientEmits()

const roomStore = useRoomStore()
const authSore = useAuthStore()
const settingStore = useSettingStore()

const router = useRouter()

const { sceneRoomRef, sceneSkyboxRef } = toRefs(settingStore)
const { currentRoom, currentParticipant } = toRefs(roomStore)
const { user } = toRefs(authSore)

const props = defineProps(['username'])

const loading = ref(false)
const localTrack = ref(false)
const activeRoom: Ref<Room | null> = ref(null)
const roomName = ref(null)

const isMediator = computed(() => currentParticipant.value?.role === 'mediator')

created()

async function getAccessToken() {
	return await axios.get(
		`http://${MEDIATION_BACK_SERVER}/token?identity=${props.username}`
	)
}

// Trigger log events
function dispatchLog(message: string) {
	emitter.emit('new_log', message)
}

// Attach the Tracks to the DOM.
function attachTracks(
	tracks: RemoteTrackPublication[],
	container: HTMLElement
) {
	tracks.forEach((t: RemoteTrackPublication) => {
		if (t.kind === 'video' && t.track) {
			container.appendChild((t.track as RemoteVideoTrack).attach())

			const htmlVideoElements = container.getElementsByTagName('video')

			if (!htmlVideoElements) return

			const htmlVideoElement = htmlVideoElements.item(
				htmlVideoElements.length - 1
			)

			if (!htmlVideoElement) return

			htmlVideoElement.style.height = '50%'
		}
	})
}

// Attach the Participant's Tracks to the DOM.
function attachParticipantTracks(
	participant: RemoteParticipant,
	container: HTMLElement
) {
	const tracks = Array.from(participant.tracks.values())
	attachTracks(tracks, container)
}

// Detach the Tracks from the DOM.
function detachTracks(
	tracks: RemoteTrackPublication[],
	container: HTMLElement
) {
	tracks.forEach((t: RemoteTrackPublication) => {
		if (t.kind === 'video' && t.track) {
			;(t.track as RemoteVideoTrack)
				.detach()
				.forEach((detachedElement: HTMLMediaElement) => {
					detachedElement.remove()
				})
		}
		while (container.firstChild) {
			container.removeChild(container.firstChild)
		}
	})
}

// Detach the Participant's Tracks from the DOM.
function detachParticipantTracks(
	participant: RemoteParticipant,
	container: HTMLElement
) {
	const tracks = Array.from(participant.tracks.values())
	detachTracks(tracks, container)
}

function leaveRoom() {
	if (currentRoom.value && user.value) {
		clientEmits.leaveRoom(user.value.name, currentRoom.value.id)
		loading.value = false
		roomName.value = null
		emitter.emit('leave_room')
	}
}

function startMeeting() {
	if (!currentRoom.value || !user.value) return
	clientEmits.startMediation(user.value.name, currentRoom.value.id, {
		skybox_asset: sceneSkyboxRef.value,
		room_asset: sceneRoomRef.value,
	})
	router.push({
		name: 'mediation',
	})
}

function createChat(room_name: any) {
	loading.value = true

	getAccessToken().then((data) => {
		roomName.value = room_name
		const token = data.data.token
		const connectOptions = {
			name: room_name,
			// logLevel: 'debug',
			audio: true,
			video: { width: 1920 },
		}
		// before a user enters a new room,
		// disconnect the user from they joined already
		// leaveRoomIfJoined()

		// remove any remote track when joining a new room
		const remoteTrack = document.getElementById('remoteTrack')
		if (!remoteTrack) return
		// remoteTrack.innerHTML = ''

		Twilio.connect(token, connectOptions).then(function (room: Room) {
			// console.log('Successfully joined a Room: ', room);
			dispatchLog('Successfully joined a Room: ' + room_name)

			// set active room
			activeRoom.value = room
			roomName.value = room_name
			loading.value = false

			// Attach the Tracks of all the remote Participants.
			room.participants.forEach(function (participant: any) {
				if (participant.identity !== props.username) {
					dispatchLog(participant.identity + ' is already here !')
				}
				const previewContainer = document.getElementById('remoteTrack')
				if (!previewContainer) return
				attachParticipantTracks(participant, previewContainer)
			})

			// When a Participant joins the Room, log the event.
			room.on('participantConnected', (participant: RemoteParticipant) => {
				dispatchLog("Joining: '" + participant.identity + "'")
			})

			// When a Participant leaves the Room, detach its Tracks.
			room.on('participantDisconnected', (participant: RemoteParticipant) => {
				dispatchLog("Participant '" + participant.identity + "' left the room")
				const previewContainer = document.getElementById('remoteTrack')
				if (!previewContainer) return
				detachParticipantTracks(participant, previewContainer)
			})

			// When a Participant adds a Track, attach it to the DOM.
			room.on(
				'trackSubscribed',
				(
					track: RemoteTrack,
					publication: RemoteTrackPublication,
					participant: RemoteParticipant
				) => {
					dispatchLog(participant.identity + ' added track: ' + track.kind)
					const previewContainer = document.getElementById('remoteTrack')
					if (!previewContainer) return
					attachTracks([publication], previewContainer)
				}
			)

			// When a Participant removes a Track, detach it from the DOM.
			room.on(
				'trackUnsubscribed',
				(
					track: RemoteTrack,
					publication: RemoteTrackPublication,
					participant: RemoteParticipant
				) => {
					dispatchLog(participant.identity + ' removed track: ' + track.kind)
					const previewContainer = document.getElementById('remoteTrack')
					if (!previewContainer) return
					detachTracks([publication], previewContainer)
				}
			)

			emitter.on('leave_room', () => {
				room.disconnect()
			})

			// if local preview is not active, create it
			if (!localTrack.value) {
				createLocalVideoTrack().then((track) => {
					const localMediaContainer = document.getElementById('localTrack')

					if (!localMediaContainer) return

					localMediaContainer.appendChild(track.attach())

					localTrack.value = true
				})
			}
		})
	})
}

function created() {
	emitter.on('show_room', (room_name: any) => {
		createChat(room_name)
	})

	// When a user is about to transition away from this page,
	// disconnect from the room, if joined.
	// window.addEventListener('beforeunload', leaveRoomIfJoined)
}
</script>

<template>
	<div class="video-area">
		<div class="room-title">
			<span v-if="loading">Loading... {{ roomName }}</span>
			<span v-else-if="!loading && roomName">Connected to {{ roomName }}</span>
			<span v-else>Select a room to get started</span>
		</div>
		<div id="remoteTrack"></div>
		<div id="localTrack"></div>
		<div v-if="currentRoom" class="video-buttons">
			<button class="button-hide-logs btn btn-danger" @click="leaveRoom">
				{{ isMediator ? 'Close meeting' : 'Leave room' }}
			</button>
			<button
				v-if="isMediator"
				class="button-hide-logs btn btn-primary"
				@click="startMeeting">
				Start meeting
			</button>
		</div>
	</div>
</template>

<style scoped src="./VisioVideo.scss"></style>
