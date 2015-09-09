// Global stuff (not module-dependant, preloading, etc)
var pubsub = require('pubsub')
var gsap = require('gsap')

// Global resize
function resize() {
  pubsub.emit('resize', window.innerWidth, window.innerHeight)
}

// Only native resize listener on site
window.addEventListener('resize', resize, false)

// Can be forced from any
pubsub.on('global-resize', resize)

// feature detection
var rootEl = document.body.parentNode

window.LCV = {}
LCV.isTouch = rootEl.classList.contains('touch');
