var pubsub = require('pubsub');

// Global resize
function resize() {
    pubsub.emit('resize', window.innerWidth, window.innerHeight);
}

// Only native resize listener on site
window.addEventListener('resize', resize, false);

// Can be forced from any
pubsub.on('global-resize', resize);

// Global stuff (not module-dependant, preloading, etc)
