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
	return true
}

startBasicCall()
	.then(res => console.log(res))
	.catch(err => console.error(err))
