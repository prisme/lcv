var mustache = require('mustache')
var parseHTML = require('parseHTML')
var pubsub = require('pubsub')
var swiper = require('swiper')

var tpl = require('home.mst')

var data, _content;



exports.init = function() {

	Cockpit.request('/collections/get/spectacles').success(function(items){
		console.log(items)
		var html = mustache.render(tpl, {items : items}) 
		_content = parseHTML(html);
		document.body.appendChild(_content);

		data = items;
	});
}

// Listen to global resizes
pubsub.on('resize', resize)
function resize(_width, _height) { 
}