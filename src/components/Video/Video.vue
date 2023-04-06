<script setup lang="ts">
import axios from 'axios'
import Twilio, { createLocalVideoTrack } from 'twilio-video'
import { ref } from 'vue'
import { emitter } from '@/client/events/event'

const props = defineProps(['username'])

const loading = ref(false)
const data = ref({})
const localTrack = ref(false)
const remoteTrack = ref('')
const activeRoom = ref('')
const previewTracks = ref('')
const identity = ref('')
const roomName = ref(null)

created()

async function getAccessToken() {
	return await axios.get(
		`http://localhost:3000/token?identity=${props.username}`
	)
}

// Trigger log events
function dispatchLog(message: string) {
	emitter.emit('new_log', message)
}

// Attach the Tracks to the DOM.
function attachTracks(tracks: any, container: any) {
	tracks.forEach(function (track: any) {
		if (track.kind === 'video') {
			container.appendChild(track.track.attach())
		}
	})
}

// Attach the Participant's Tracks to the DOM.
function attachParticipantTracks(participant: any, container: any) {
	const tracks = Array.from(participant.tracks.values())
	attachTracks(tracks, container)
}

// Detach the Tracks from the DOM.
function detachTracks(tracks: any) {
	tracks.forEach((track: any) => {
		track.detach().forEach((detachedElement: any) => {
			detachedElement.remove()
		})
	})
}

// Detach the Participant's Tracks from the DOM.
function detachParticipantTracks(participant: any) {
	const tracks = Array.from(participant.tracks.values())
	detachTracks(tracks)
}

// Leave Room.
function leaveRoomIfJoined() {
	if (activeRoom.value) {
		activeRoom.value = ''
	}
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
		leaveRoomIfJoined()

		// remove any remote track when joining a new room
		const remoteTrack = document.getElementById('remoteTrack')
		if (!remoteTrack) return
		remoteTrack.innerHTML = ''

		Twilio.connect(token, connectOptions).then(function (room: any) {
			// console.log('Successfully joined a Room: ', room);
			dispatchLog('Successfully joined a Room: ' + room_name)

			// set active room
			activeRoom.value = room
			roomName.value = room_name
			loading.value = false

			// Attach the Tracks of all the remote Participants.
			room.participants.forEach(function (participant: any) {
				const previewContainer = document.getElementById('localTrack')
				attachParticipantTracks(participant, previewContainer)
			})

			// When a Participant joins the Room, log the event.
			room.on('participantConnected', function (participant: any) {
				dispatchLog("Joining: '" + participant.identity + "'")
			})

			// When a Participant adds a Track, attach it to the DOM.
			room.on('trackAdded', function (track: any, participant: any) {
				dispatchLog(participant.identity + ' added track: ' + track.kind)
				const previewContainer = document.getElementById('remoteTrack')
				attachTracks([track], previewContainer)
			})

			// When a Participant removes a Track, detach it from the DOM.
			room.on('trackRemoved', function (track: any, participant: any) {
				dispatchLog(participant.identity + ' removed track: ' + track.kind)
				detachTracks([track])
			})

			// When a Participant leaves the Room, detach its Tracks.
			room.on('participantDisconnected', function (participant: any) {
				dispatchLog("Participant '" + participant.identity + "' left the room")
				detachParticipantTracks(participant)
			})

			// if local preview is not active, create it
			if (!localTrack.value) {
				createLocalVideoTrack().then((track) => {
					const localMediaContainer = document.getElementById('localTrack')

					if (!localMediaContainer) return

					localMediaContainer.appendChild(track.attach())

					const htmlVideoElement = document
						.getElementsByTagName('video')
						.item(0)

					if (!htmlVideoElement) return

					htmlVideoElement.style.maxWidth = '100%'

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
	window.addEventListener('beforeunload', leaveRoomIfJoined)
}
</script>

<template>
	<div class="video-area">
		<div class="room-title">
			<span v-if="loading">Loading... {{ roomName }}</span>
			<span v-else-if="!loading && roomName">Connected to {{ roomName }}</span>
			<span v-else>Select a room to get started</span>
		</div>
		<div class="row remote_video_container">
			<div id="remoteTrack"></div>
		</div>
		<div id="localTrack"></div>
	</div>
</template>

<style scoped src="./Video.scss"></style>
