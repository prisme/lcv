var mustache = require('mustache')
var parseHTML = require('parseHTML')
var pubsub = require('pubsub')
var swiper = require('swiper')

// Current state of module
// Can also be 'loading', 'ready', 'on' and 'leaving'
// 'off' = the module is inactive
// 'loading' = the data is loading, nothing is shown
// 'ready' = the content is ready, but still animating or preloading files
// 'on' = all animated and preloaded
// 'leaving' = exit has been called, animating out
var state = 'off';
exports.state = state;

var tpl = require('home.mst')
var data, _content


exports.enter = function() {
  if (_content) {
      ready();
      return;
  }
  loadData();
}

// 2. Load data
function loadData(){
  state = 'loading';

  Cockpit.request('/collections/get/spectacles').success(function(items){
    data = items;

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
      items = Object.keys(items).map(function (key) {return items[key]});
      // replace data.visuel props with actual urls
      data.forEach(function(d,i){ d.visuel = items[i] })


      // if state changed while loading cancel
      if (state !== 'loading') return;
      compileTemplate(data);
    });
  });
}

// 3. Compile a DOM element from the template and data
function compileTemplate(data) {
    var html = mustache.render(tpl, {items : data}) 
    _content = parseHTML(html);
    TweenLite.set(_content, {autoAlpha: 0})

    ready();
}

// 4. Content is ready to be shown
function ready() {
  state = 'ready';

  // Select elements
  document.body.appendChild(_content);
console.log(swiper)

  var mySwiper = new swiper('.swiper-container', {
    speed: 400,
    effect : 'fade',
    fade: {
      crossFade: true
    },
    paginationBulletRender: function (index, className) {
      return '<span class="' + className + '">' + '0'+(index + 1) + '</span>';
    },
    pagination : '.swiper-pagination',
    paginationClickable : true,
    keyboardControl: true
  });  

  animateIn();
  
  // For resize:
  //     either force a global resize from common.js
  // pubsub.emit('global-resize');

  //     or just keep it local
  // resize(window.innerWidth, window.innerHeight);
}

// 5. Final step, animate in page
function animateIn() {
    TweenLite.to(_content, 1, {
        autoAlpha: 1, 
        force3D: true,
        onComplete: function() {

            // End of animation
            state = 'on';
        }
    });
}

// Triggered from router.js
exports.exit = function (ctx, next){
};

function animateOut(next) {
}

// Listen to global resizes
pubsub.on('resize', resize)
function resize(_width, _height) { 
}