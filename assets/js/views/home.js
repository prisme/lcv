var pubsub = require('pubsub')
var swiper = require('swiper')

exports.init = function() {
	console.log('home')
}

// Listen to global resizes
pubsub.on('resize', resize)
function resize(_width, _height) { 
}