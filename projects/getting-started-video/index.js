// * https://docs.agora.io/en/Video/start_call_web_ng?platform=Web#basic-process
var rtc = {
	client: null,
	localAudioTrack: null,
	localVideoTrack: null,
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

async function startBasicCall() {
	try {
		// * Create RTC client
		rtc.client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })

		// * Join a channel
		const uid = await rtc.client.join(options.appId, options.channel, options.token, null)
		console.log('Your user ID is: ', uid)

		// * Create an audio track linked to the user's microphone
		rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack()
		// * Create a video track linked to the user's camera
		rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack()

		const id = uid.toString()
		createVideoUI({ id })
		rtc.localVideoTrack.play(id)

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
	} catch (err) {
		console.error(err)
	}
}

async function leaveCall() {
	try {
		rtc.localAudioTrack.close()
		rtc.localVideoTrack.close()

		await rtc.client.leave()
	} catch (err) {
		console.error(err)
	}
}
