var gsap = require('gsap')
var pubsub = require('pubsub')

var _component, _openPrompt, _closePrompt, _logo, _links, _hidden

exports.init = function() {
    ready()
    addHandlers()
}

function ready(){
	_component = document.querySelector('.menu')
	_openPrompt = document.querySelector('.menu-prompt')
	_closePrompt = document.querySelector('.menu .close')
	_logo =  document.querySelector('.logo')
	_links = _component.querySelectorAll('a')
	_hidden = null

	_closePrompt.dataset.preventDefault = true;

	TweenLite.set(_component, {autoAlpha:0})
}

function addHandlers(){
	var eventName = LCV.isTouch ? 'touchend' : 'click'

	_openPrompt.addEventListener(eventName, show)
	_closePrompt.addEventListener(eventName, hide)

	for (var i = 0; i < _links.length; i++) {
		_links[i].addEventListener('click', hide)
	};
	
	function show(){
		// set once : menu has to be shown before it can be hidden
		_hidden = hiddenElements() 
		
		TweenLite.to(_component, 0.5, { autoAlpha: 1})
		TweenLite.to([_openPrompt, _logo], 0.5, { autoAlpha: 0})
		TweenLite.to(_hidden, 0.1, { autoAlpha: 0})

		pubsub.emit('menu:open')
	}

	function hide(e){
		if( !!e.target.dataset.preventDefault ){
			e.preventDefault();
			TweenLite.to(_hidden, 0.1, { autoAlpha: 1})
		}
		
		TweenLite.to(_component, 0.5, { autoAlpha: 0})
		TweenLite.to([_openPrompt, _logo], 0.5, { autoAlpha: 1})

		pubsub.emit('menu:close')
	}

	function hiddenElements(){		
		var elts = rootEl.querySelectorAll('.section .menu-hide')

		if( !elts.length )
			elts = rootEl.querySelectorAll('.section *')

		console.log(elts)

		return elts
	}
}