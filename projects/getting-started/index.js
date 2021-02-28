navigator.mediaDevices.getUserMedia({
	audio: true,
	video: true,
}).then(res => {
	console.log(res)
}).catch(err => {
	console.error(err)
	alert(`getUserMedia() error: ${err.name}`)
})
