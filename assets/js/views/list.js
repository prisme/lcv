// Use instance template for 'many of a kind' such as list items
// Will be instantiated and destroyed after use
module.exports = instance

var page = require('page')
var gsap = require('gsap')
var parseHTML = require('parseHTML')
var pubsub = require('pubsub')
var _ = require('lodash')
var Ps = require('perfect-scrollbar')

var template = require('list.hbs')
var tplPresse = require('list-presse.hbs')

function instance() {
  var _this = this

  // Current state of module :
  // 'off' = the module is inactive
  // 'loading' = the data is loading, nothing is shown
  // 'ready' = the content is ready, but still animating or preloading files
  // 'on' = all animated and preloaded
  // 'leaving' = exit has been called, animating out
  var state = 'off'

  var data, content, container

  // 1. triggered from router.js
  _this.enter = function (ctx){
    loadData(ctx)
  }

  // 2. Load data
  function loadData(ctx){
    state = 'loading'

    if (data || ctx.state.instance){
      compileTemplate(data, ctx) 
      return
    }

        
    Cockpit
    .request('/collections/get/'+ctx.params.list, {sort: {'spectacle':1}})
    .success(function(items){
      console.log(items)
        
      // Prep data, template specifics
      items.forEach(function(item){
        if(item.hasOwnProperty('date') && typeof item.date === 'string'){
          item.date = item.date.split('-')[0]
        }
        
        item.root = rootPath +'/'+ ctx.params.list

        if( ctx.params.list === 'presse' ) {
          Cockpit
          .request('/collections/get/spectacles', { filter: {_id: item.spectacle}} )
          .success(function(spectacle){
            item.spectacle = {
              titre : spectacle[0].titre,
              titre_slug : spectacle[0].titre_slug 
            }
          })
        }

      })


      data = items
      console.log(data)
        
      // Media manager 
      var imgs = items.map(function(item){ return item.visuel })
      Cockpit
        .request('/mediamanager/thumbnails', {
          images: imgs,
          w: window.innerWidth, h: window.innerHeight,
          options: { quality : 70, mode : 'best_fit' }
        })
        .success(function(items){
          // transmute object containing urls to array
          items = Object.keys(items).map(function (key) {return items[key]})
          // replace data.visuel props with actual urls
          data.forEach(function(d,i){ d.visuel = items[i] })

          // Cache data
          ctx.state.instance = data
          ctx.save()

          // if state changed while loading cancel
          if (state !== 'loading') return
          compileTemplate(data, ctx)
        })
        
    })
        
  }

  // 3. Compile a DOM element from the template and data
  function compileTemplate(data, ctx) {
    data = data || ctx.state.instance

    if( ctx.params.list === 'presse' ) 
      template = tplPresse

    var html = template({ 'list': data })
    content = parseHTML(html)
    ready(ctx)
  }

  // 4. Content is ready to be shown
  function ready(ctx) {
    state = 'ready'
    TweenLite.set(content, {autoAlpha: 0})
    rootEl.appendChild(content)


    container = document.querySelector('.section.list .items')
    Ps.initialize(container)

    animateIn()
  }

  // 5. Final step, animate in page
  function animateIn() {
    TweenLite.to(content, 0.7, {
      autoAlpha: 1, 
      ease: Power1.easeIn, 
      onComplete: function() {
        // End of animation
        state = 'on'
      }
    })
  }

  // Triggered from router.js
  _this.exit = function (ctx, next){

    // If user requests to leave before content loaded
    if (state == 'off' || state == 'loading') {
      console.info('left before loaded')
      next()
      return
    }
    if (state == 'ready') console.info('still animating on quit')

    state = 'leaving'

    // Remove instance of self from ctx
    delete ctx.instance
        
    animateOut(next)
  }

  function animateOut(next) {
    TweenLite.to(content, 0.5, {
      autoAlpha: 0, 
      ease: Power1.easeOut, 
      onComplete: function() {
        Ps.destroy(container)
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
    Ps.update(container)
  }

}
