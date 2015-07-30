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
        
        var instance;

        // @todo : switch should be replaced by if indexOf in routes array…
        switch(ctx.params.list){ 
            case 'ateliers' : case 'spectacles' : 
                if( typeof ctx.params.item !== 'undefined'){
                    console.log('item')
                    instance = item
                }
                else{
                    console.log('list')
                    instance = list;
                }
                break;
            default :
                instance = false
        }

        // If url not in list, redirect towards home (404)
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

    // init globals
    menu.init();
};