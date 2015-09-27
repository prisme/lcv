var page = require('page');

// Import all views
var menu = require('menu');
var home = require('home');
var list = require('list'); 
var item = require('item');

var instances = {
    list: list,
    item: item,
};

exports.page = page;

exports.init = function(ROOT) {

    // Create enter and exit per view
    page('/', home.enter);
    page.exit('/', home.exit);

    page('/:list', enterInstance);
    page.exit('/:list', exitInstance);

    page('/:list/:item', enterInstance);
    page.exit('/:list/:item', exitInstance);

    function enterInstance(ctx, next) { 
        console.log('enterInstance')
        var instance;

        // @todo : switch should be replaced by if indexOf in routes array…
        // @todo : routes should be pulled dynamically from Cockpit
        switch(ctx.params.list){ 
            // collections
            case 'ateliers' : case 'spectacles' : case 'lcv' : 
                if( typeof ctx.params.item !== 'undefined'){
                    instance = item
                }
                else{
                    instance = list
                }
                break
            // static pages
            case 'presse' : 
                instance = list
                break
            case 'contact' : 
                instance = item
                break
            // 404
            default :
                instance = false
        }

        // If url not in list, redirect to home (404)
        if (!instance) {
            page('/');
            return;
        }

        // Create new instance and initialise
        ctx.instance = new instance();
        ctx.instance.enter(ctx);
    }

    function exitInstance(ctx, next) {

        // instance won't exist for 404 pages, so skip to enter
        if (!ctx.instance) {
            next();
            return;
        }
        ctx.instance.exit(ctx, next);
    }

    // Activate page
    page.base(ROOT);
    page.start();

    // init main nav
    // @todo : pass Cockpit dynamic routes to menu.init => inject dynamic template    
    menu.init();
};