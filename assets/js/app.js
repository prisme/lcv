var common = require('common')
var router = require('router')

window.rootPath = window.location.href.indexOf('localhost') > -1 ? '/sandbox/lcv' : ''
window.rootEl = document.querySelector('.page')

router.init(rootPath)