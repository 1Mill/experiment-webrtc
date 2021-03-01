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

				// * Create UI element to display video in
				const playerContainer = document.createElement('div')
				playerContainer.id = user.uid.toString()
				playerContainer.style = {
					height: '480px',
					width: '640px',
				}
				document.body.append(playerContainer)

				// * Play the remote video track
				remoteVideoTrack.play(playerContainer.id)
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
