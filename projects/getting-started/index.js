var peer = new Peer()

peer.on('open', function(id) {
	console.log('Your ID is: ', id)
})
