console.log('hello world!')

navigator.mediaDevices.getUserMedia({
	audio: true,
	video: true,
}).then(res => {
	console.log(res)
}).catch(err => {
	console.error(err)
})
