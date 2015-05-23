(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
console.log('▲');

var common = require('common');

},{"common":3}],2:[function(require,module,exports){
/*
 *
 * PubSub for simple communication between modules
 *
 * use:
 *
 * var pubsub = require('pubsub');
 *
 * function func(arg1, arg2) {
 *     console.log(arg1 + ' ' + arg2);
 * }
 *
 * pubsub.on('hello', func);
 * or
 * pubsub.once('hello', func);
 *
 * pubsub.emit('hello', 'Hello', 'World');
 *
 * pubsub.off('hello', func); // function specific
 * or
 * pubsub.off('hello'); // all listeners for 'hello'
 * or
 * pubsub.off(); // resets pubsub
 *
 *
 * console.log(pubsub.listeners()); // Object of all current listeners
 */ 

var _listeners = {};

var em = {

    _addListener: function(call, listener, once) {
        if (typeof listener !== 'function') {
            console.error('listener must be a function');
            return;
        }

        _listeners[call] = _listeners[call] || [];

        // If already subscribed, don't duplicate
        var match;
        _listeners[call].every(function(e, i) {
            if (e.listener == listener) {
                match = true;
                return false;
            }
            return true;
        });
        if (match) {
            console.error('listener already subscribed');
            return;
        }

        _listeners[call].push({
            once: once,
            fn: function () {
                return listener.apply(this, arguments);
            },

            // Store string to test against during removal
            listener: listener
        });
    },

    listeners: function () {
        return _listeners;
    },

    on: function (call, listener) {
        em._addListener(call, listener, 0);
    },

    once: function (call, listener) {
        em._addListener(call, listener, 1);
    },

    off: function (call, listener) {

        // If precise listener included, only remove that listing
        if (listener) {
            if (!_listeners[call]) {
                console.error('Event "' + call + '" doesn\'t exist');
                return;
            }

            _listeners[call].every(function(e, i) {
                if (e.listener == listener) {
                    _listeners[call].splice(i, 1);

                    if (_listeners[call].length === 0) delete _listeners[call];
                    return false;
                }

                return true;
            });

        // Remove all listeners for the call
        } else if (call) {
            delete _listeners[call];
            return;
        }

        // Remove all listeners of all calls

        //TODO: which is better ?
        if (!call) for (var e in _listeners) delete _listeners[e];
        // if (!call) _listeners = {};
    },

    emit: function (call) {
        if (!_listeners[call]) {
            console.error('Noone listening to event: "' + call + '"');
            return;
        }

        var args = Array.prototype.slice.call(arguments, 1);

        // Reverse, so that the functions are called in the right order during backwards loop
        _listeners[call].reverse();

        // Loop backwards, so that listeners can be removed during if only triggered once
        for (var i = _listeners[call].length - 1; i >= 0; i--) {
            var e = _listeners[call][i];
            e.fn.apply(this, args);

            // remove events that run only once
            // if (e.once) em.off(call, e.listener);
            if (e.once) {
                _listeners[call].splice(i, 1);
                if (_listeners[call].length === 0) delete _listeners[call];
            }
        }

        // Reverse list again to normal direction
        if (_listeners[call]) _listeners[call].reverse();
    }
};

module.exports = em;




},{}],3:[function(require,module,exports){
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

},{"pubsub":2}]},{},[1])


//# sourceMappingURL=bundle.js.map