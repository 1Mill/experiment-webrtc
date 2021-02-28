// * https://docs.agora.io/en/Voice/start_call_audio_web_ng?platform=Web#method-2-through-the-cdn
var rtc = {
	client: null,
	localAudioTrack: null,
}
var options = {
	appId: window.$_projectEnvironment.appId,
	channel: 'demo_channel_name',
	token: window.$_projectEnvironment.token,
}

async function startBasicCall() {
	// * Initialize
	rtc.client = AgoraRTC.createClient({ codec: 'vp8', mode: 'rtc' })

	// * Generate ID
	var uid = await rtc.client.join(options.appId, options.channel, options.token, null)

	// * Access microphone
	rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack()
	// * Publish channel
	await rtc.client.publish([rtc.localAudioTrack])

	console.log('Success!')

	return true
}

startBasicCall()
	.then(res => console.log(res))
	.catch(err => console.error(err))
