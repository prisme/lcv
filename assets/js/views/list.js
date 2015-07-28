module.exports = List

var page = require('page');
var mustache = require('mustache')
var parseHTML = require('parseHTML')
var pubsub = require('pubsub')

var tpl = require('list.mst')

function List() {
  var _this = this

  var state = 'off'

  var data, content

  // 1. triggered from router.js
  _this.enter = function (ctx){
      loadData(ctx);
  };

  // 2. Load data
  function loadData(ctx){
    state = 'loading';

    Cockpit.request('/collections/get/spectacles').success(function(items){
      console.log(items)
      data = items

      // Check if item exists in data, if not, redirect to index
      // if (!data[ctx.params.item]) {

      //     // Remove instance so that exit isn't called
      //     delete ctx.instance;
      //     page('/');
      //     return;
      // }

      // Cache data
      ctx.state.item = data;
      ctx.save();

      // if state changed while loading cancel
      if (state !== 'loading') return;
      compileTemplate(ctx);

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

    console.log(state)

    // Select elements
    document.body.appendChild(_content);

    animateIn();
  }

  // 5. animate in page
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
  _this.exit = function (ctx, next){
  };

  function animateOut(next) {
    TweenLite.to(content, 0.5, {
        autoAlpha: 0, 
        onComplete: function() {
            content.parentNode.removeChild(content);

            // End of animation
            state = 'off';

            // Let next view start loading
            next();
        }
    });
  }

  // Listen to global resizes
  pubsub.on('resize', resize)
  function resize(_width, _height) { 
  }

}
