// Use static template for 'one of a kind' pages like home
// Is never destroyed
var gsap = require('gsap')
var mustache = require('mustache')
var parseHTML = require('parseHTML')
var pubsub = require('pubsub')
var swiper = require('swiper')
var _ = require('lodash')

var template = require('home.hbs')

// Current state of module
// Can also be 'loading', 'ready', 'on' and 'leaving'
// 'off' = the module is inactive
// 'loading' = the data is loading, nothing is shown
// 'ready' = the content is ready, but still animating or preloading files
// 'on' = all animated and preloaded
// 'leaving' = exit has been called, animating out
var state = 'off'

var data, content

// 1. triggered from router.js
exports.enter = function (ctx){
  if (content) {
    ready(ctx)
    return
  }
  loadData(ctx)
}

// 2. Load data
function loadData(ctx){
  state = 'loading'
    
  if (data || ctx.state.static){
    compileTemplate(ctx) 
    return
  }

  Cockpit.request('/collections/get/spectacles').success(function(items){

    var featured = _.filter(items, function(item){ return item.featured == true })
    featured = _.sortBy(featured, 'featuredPosition')
    items = featured.concat(items)
    data = items.slice(0,3) 

    console.log(data)

    /* media manager */
    var imgs = items.map(function(item){ return item.visuel })
    Cockpit
      .request('/mediamanager/thumbnails', {
        images: imgs,
        w: 1920, h: 1080,
        options: { quality : 80, mode : 'best_fit' }
      })
      .success(function(items){

        // transmute object containing urls to array
        items = Object.keys(items).map(function (key) {return items[key]})
        // replace data.visuel props with actual urls
        data.forEach(function(d,i){ d.visuel = items[i] })

        // Cache data
        ctx.state.static = data
        ctx.save()

        // if state changed while loading cancel
        if (state !== 'loading') return
        compileTemplate(data)
      })
  })
}

// 3. Compile a DOM element from the template and data
function compileTemplate(ctx) {

  data = data || ctx.state.static // !!!

  // var html = template({items: data})
  var html = template({items : data})
  content = parseHTML(html)
  ready(ctx)
}

// 4. Content is ready to be shown
function ready(ctx) {
  state = 'ready'

  rootEl.appendChild(content)

  var homeSwiper = new swiper('.swiper-container', {
      speed: 1200,
      autoplay: 5000,
      effect: 'fade',
      fade: {
        crossFade: true
      },
      paginationBulletRender: function (index, className) {
        return '<span class="' + className + '">' + '0'+(index + 1) + '</span>'
      },
      pagination: '.swiper-pagination',
      paginationClickable: true,
      keyboardControl: true
    })  

  pubsub.on('menu:open', homeSwiper.stopAutoplay)
  pubsub.on('menu:close', homeSwiper.startAutoplay)

  animateIn()
    
  // For resize:
  //     either force a global resize from common.js
  // pubsub.emit('global-resize')

  //     or just keep it local
  // resize(window.innerWidth, window.innerHeight)
}

// 5. Final step, animate in page
function animateIn() {
  // bugfix
  var hidden = content.querySelectorAll('.menu-hide')
  TweenLite.set(hidden, { autoAlpha: 1})

  TweenLite.to(content, 0.5, {
    autoAlpha: 1, 
    onComplete: function() {

      // End of animation
      state = 'on'
    }
  })
}

// Triggered from router.js
exports.exit = function (ctx, next){
  
  // If user requests to leave before content loaded
  if (state == 'off' || state == 'loading') {
    console.log('left before loaded')
    next()
    return
  }
  if (state == 'ready') console.log('still animating on quit')

  state = 'leaving'
    
  animateOut(next)

  // Let next view start loading
  // next()
}

function animateOut(next) {
  TweenLite.to(content, 0.5, {
    autoAlpha: 0, 
    onComplete: function() {
      content.parentNode.removeChild(content)

      // End of animation
      state = 'off'

      // Let next view start loading
      next()
    }
  })
}

// Listen to global resizes
pubsub.on('resize', resize)
function resize(_width, _height) { 
}
