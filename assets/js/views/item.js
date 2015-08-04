// Use instance template for 'many of a kind' such as list items
// Will be instantiated and destroyed after use
module.exports = instance;

var page = require('page');
var gsap = require('gsap');
var parseHTML = require('parseHTML');
var pubsub = require('pubsub');

var template = require('item.hbs');

function instance() {
    var _this = this;

    // var dataUrl = 'assets/data/test.json';

    // Current state of module
    // Can also be 'loading', 'ready', 'on' and 'leaving'
    // 'off' = the module is inactive
    // 'loading' = the data is loading, nothing is shown
    // 'ready' = the content is ready, but still animating or preloading files
    // 'on' = all animated and preloaded
    // 'leaving' = exit has been called, animating out
    var state = 'off';

    var data, content;

    // 1. triggered from router.js
    _this.enter = function (ctx){
        loadData(ctx);
    };

    // 2. Load data
    function loadData(ctx){
        state = 'loading';

        if (data || ctx.state.instance){
            compileTemplate(ctx); 
            return;
        }
        
        Cockpit
        .request('/collections/get/'+ctx.params.list, { filter: {titre_slug: ctx.params.item}})
        .success(function(items){
            console.log(items)
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

                // Cache data
                ctx.state.instance = data;
                ctx.save();

                // if state changed while loading cancel
                if (state !== 'loading') return;
                compileTemplate(data);
            });

        });
        
    }

    // 3. Compile a DOM element from the template and data
    function compileTemplate(ctx) {
        data = data || ctx.state.instance // !!!

        var html = template({item: data});
        content = parseHTML(html);
        ready(ctx);
    }

    // 4. Content is ready to be shown
    function ready(ctx) {
        state = 'ready';
        rootEl.appendChild(content);
        animateIn();
    }

    // 5. Final step, animate in page
    function animateIn() {
        TweenLite.to(content, 0.5, {
            autoAlpha: 1, 
            onComplete: function() {
                // End of animation
                state = 'on';
            }
        });
    }

    // Triggered from router.js
    _this.exit = function (ctx, next){

        // If user requests to leave before content loaded
        if (state == 'off' || state == 'loading') {
            console.log('left before loaded');
            next();
            return;
        }
        if (state == 'ready') console.log('still animating on quit');

        state = 'leaving';

        // Remove instance of self from ctx
        delete ctx.instance;
        
        animateOut(next);
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
    pubsub.on('resize', resize);
    function resize(_width, _height) { 
        
    }

}
