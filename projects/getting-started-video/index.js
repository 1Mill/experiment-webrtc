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
		await rtc.client.join(options.appId, options.channel, options.token, null)
		console.log('Your user ID is: ', rtc.client.uid)

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
		videoElement.create({ id: rtc.client.uid.toString() })
		rtc.localVideoTrack.play(rtc.client.uid.toString())

		rtc.client.on('user-published', async (user, mediaType) => {
			await rtc.client.subscribe(user, mediaType)
			console.log('Successfully subscribed to user')

			if (mediaType === 'video') {
				// * Play the remote video track
				const id = user.uid.toString()
				videoElement.create({ id })
				user.videoTrack.play(id)
			}

			if (mediaType === 'audio') {
				// * Play the audio track
				user.audioTrack.play()
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

		videoElement.destroy({ id: rtc.client.uid.toString() })

		await rtc.client.leave()
	} catch (err) {
		console.error(err)
	}
}

async function toggleVideo() {
	try {
		if (rtc.localVideoTrack.isPlaying) {
			await rtc.client.unpublish([
				rtc.localVideoTrack
			])
			rtc.localVideoTrack.stop()
		} else {
			rtc.localVideoTrack.play(rtc.client.uid.toString())
			await rtc.client.publish([
				rtc.localVideoTrack
			])
		}
	} catch (err) {
		console.error(err)
	}
}
