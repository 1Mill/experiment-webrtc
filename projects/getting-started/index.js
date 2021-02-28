// * https://docs.agora.io/en/Voice/start_call_audio_web_ng?platform=Web#method-2-through-the-cdn
var rtc = {
	client: null,
	localAudioTrack: null,
}
var options = {
	appId: window.$_projectEnvironment.appId,
	channeL: 'demo_channel_name',
	token: null,
}

async function startBasicCall() {
	console.log('TESTING')

	rtc.client = AgoraRTC.createClient({ mode: 'live', codec: 'vp8' })

	return true
}

startBasicCall()
	.then(res => console.log(res))
	.catch(err => console.error(err))
