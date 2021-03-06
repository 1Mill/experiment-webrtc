// * https://docs.agora.io/en/Video/start_call_web_ng?platform=Web#basic-process
var rtc = {
	client: null,
	localAudioTrack: null,
	localVideoTrack: null,
	uid: null,
}
var options = {
	appId: window.$_projectEnvironment.appId,
	channel: 'demo_channel_name',
	token: window.$_projectEnvironment.token,
}

function createVideoUI({ id }) {
	// * Create UI element to display video in
	const playerContainer = document.createElement('div')
	playerContainer.id = id
	playerContainer.style.height = '480px'
	playerContainer.style.width = '640px'
	document.body.append(playerContainer)
	return playerContainer
}

const videoElement = {
	create: ({ id }) => {
		const el = document.createElement('div')

		el.id = id
		el.style.border = '1px solid red;'
		el.style.height = '480px'
		el.style.width = '640px'

		document.body.append(el)
	},
	destroy: ({ id }) => {
		const el = document.getElementById(id)
		if (!el) { return }
		el.remove()
	}
}

async function startBasicCall() {
	try {
		// * Create RTC client
		rtc.client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })

		// * Join a channel
		rtc.uid = (await rtc.client.join(options.appId, options.channel, options.token, null)).toString()
		console.log('Your user ID is: ', rtc.uid)

		// * Create an audio track linked to the user's microphone
		rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack()
		// * Create a video track linked to the user's camera
		rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack()

		videoElement.create({ id: rtc.uid })
		rtc.localVideoTrack.play(rtc.uid)

		// * Publish the audio and video tracks to the joined channel
		await rtc.client.publish([
			rtc.localAudioTrack,
			rtc.localVideoTrack,
		])
		console.log('Audo and video tracks successfully published!')

		rtc.client.on('user-published', async (user, mediaType) => {
			await rtc.client.subscribe(user, mediaType)
			console.log('Successfully subscribed to user')

			if (mediaType === 'video') {
				// * Get video from user
				const remoteVideoTrack = user.videoTrack

				// * Play the remote video track
				const id = user.uid.toString()
				createVideoUI({ id })
				remoteVideoTrack.play(id)
			}

			if (mediaType === 'audio') {
				// * Get audio from user
				const remoteAudioTrack = user.audioTrack

				// * Play the audio track
				remoteAudioTrack.play()
			}
		})

		rtc.client.on('user-unpublished', async (user, _mediaType) => {
			videoElement.destroy({ id: user.uid.toString() })
		})
	} catch (err) {
		console.error(err)
	}
}

async function leaveCall() {
	try {
		rtc.localAudioTrack.close()
		rtc.localVideoTrack.close()

		videoElement.destroy({ id: rtc.uid.toString() })

		await rtc.client.leave()
	} catch (err) {
		console.error(err)
	}
}
