// Use instance template for 'many of a kind' such as list items
// Will be instantiated and destroyed after use
module.exports = instance

var page = require('page')
var gsap = require('gsap')
var parseHTML = require('parseHTML')
var pubsub = require('pubsub')
var Ps = require('perfect-scrollbar')
var PhotoSwipe = require('photoswipe')
var PhotoSwipeUI_Default = require('photoswipe/dist/photoswipe-ui-default.min.js')

var template = require('item.hbs')
var tplContact = require('form-contact.hbs')

function instance() {
  var _this = this

  // Current state of module
  // Can also be 'loading', 'ready', 'on' and 'leaving'
  // 'off' = the module is inactive
  // 'loading' = the data is loading, nothing is shown
  // 'ready' = the content is ready, but still animating or preloading files
  // 'on' = all animated and preloaded
  // 'leaving' = exit has been called, animating out
  var state = 'off'

  var data, content, scrollContainer, gallery

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
    
    // static pages : /contact
    if( ctx.params.list == 'contact' ){
      Cockpit.request('/cockpit/call', {
        module: 'forms',
        method: 'form',
        args: ['form', {name: 'Contact', class: 'contact-form'}]
      })
      .success(function(response){
        var html = '<div class="section contact">'
        html += response
        html += tplContact()
        html += '</div>'
        
        content = parseHTML(html)
        eval(content.children[0].innerHTML)
        ready(ctx)
      })

      return

    }
    
    Cockpit
    .request('/collections/get/'+ctx.params.list, { filter: {titre_slug: ctx.params.item}})
    .success(function(items){
      console.log(items)
      data = items

      if( ctx.params.list == 'lcv' ){
        data[0].statut = 'les comédiens voyageurs'
      }

      /* media manager => function */
      var imgs = items.map(function(item){ return item.visuel }) // main 

      Cockpit
      .request('/mediamanager/thumbnails', {
        images: imgs,
        w: 1920, h: 1080,
        options: { quality : 60, mode : 'best_fit' }
      })
      .success(function(imgs){

        // transmute object containing url to array
        imgs = Object.keys(imgs).map(function (key) {return imgs[key]})
        // replace prop with actual url
        data[0].visuel = imgs[0]

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
    data = data || ctx.state.instance // !!!

    var html = template({'item': data})
    content = parseHTML(html)
    ready(ctx)
  }

  // 4. Content is ready to be shown
  function ready(ctx) {
    state = 'ready'

    TweenLite.set(content, {autoAlpha: 0})
    rootEl.appendChild(content)

    scrollContainer = document.querySelector('.item .wrap')
    if(scrollContainer !== null)
      Ps.initialize(scrollContainer)
    
    if( ctx.params.list == 'contact' ){
      animateIn()
      return
    }

    setTimeout(function(){
      var img = document.querySelector('.visual')
      if (img == null) return

      content.style.backgroundImage = 'url(' + img.src + ')'
      TweenLite.set(img, {display:'none'})
    }, 0)
    

    if( typeof data[0].photos !== 'undefined' ) 
      setTimeout(initGallery, 1000)

    animateIn()
  }

  function initGallery(){
    
    var thumbs, zooms
    var ckpImages = data[0].photos.map(function(item){ return item.path })

    // get thumbs
    Cockpit
    .request('/mediamanager/thumbnails', {
      images: ckpImages,
      w: 300, h: 300,
      options: { quality : 100, mode : 'best_fit' }
    })
    .success(function(paths){
      thumbs = Object.keys(paths).map(function (key) {return paths[key]})
      console.log('thumbs',thumbs)
      
      // get zooms
      Cockpit
      .request('/mediamanager/thumbnails', {
        images: ckpImages,
        w: 1920, h: 1080,
        options: { quality : 80, mode : 'best_fit' }
      })
      .success(function(paths){
        console.log(paths)
        zooms = Object.keys(paths).map(function (key) {return paths[key]})
        console.log('zooms',zooms)

        // compile & append template
        var galleryTpl = require('gallery.hbs')

        var photos = []
        thumbs.forEach(function(element,index){
          photos[index] = { 
            'thumb' : element,
            'src' : zooms[index]
          }
        })
        
        var html = galleryTpl({'photos': photos})
        var frag = parseHTML(html)
        scrollContainer.appendChild(frag)

        // init PhotoSwipe
        var pswpElement = document.querySelectorAll('.pswp')[0];
        var slides = []
        zooms.forEach(function(url){
          // measure zoom image dimensions… T_T
          var img = document.createElement('img')
          img.addEventListener('load', function(){

            // add to PhotoSwipe slides object
            slides[slides.length] = {
              src : url,
              w: this.width, h: this.height 
            }

            var options = { 
              mainClass : 'pswp--minimal--dark',
              history : false,
              barsSize : {top:0, bottom:0},
              captionEl : false,
              counterEl : false,
              fullscreenEl : false,
              shareEl : false,
              bgOpacity : 0.85,
              tapToClose : true,
              tapToToggleControls : false,
              closeOnScroll: false  
            }

            // galleryEvents
            var links = document.querySelectorAll('.gallery a')
            for (var i = 0; i < links.length; i++) {

              links[i].addEventListener('click', function(e){

                var index =  parseInt(this.dataset.index, 10)
                options.index = index
                gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, slides, options);
                gallery.init()

                e.preventDefault()
              })
            }
          })
          img.src = url
          



          

        })

        

      })
      
    })
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
        Ps.destroy(scrollContainer)
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
    Ps.update(scrollContainer)
  }

  

}
