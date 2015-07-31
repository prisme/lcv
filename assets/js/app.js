var common = require('common')
var router = require('router')

if ( !!window.location.href.indexOf('localhost') > -1 )
	window._ROOT = '/sandbox/lcv'; 
else
	window._ROOT = ''; 

router.init(_ROOT);