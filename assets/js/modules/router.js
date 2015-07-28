var page = require('page');

// Import all views
var home = require('home');
var item = require('instance'); 
var other = require('instance');

var instances = {
    item: item,
    other: other,
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
        console.log('enterInstance', ctx)
        
        var instance = false;

        switch(ctx.params.list) {
            case 'ateliers' :
                instance = item;
                break;
            case 'spectacles' :
                instance = other;
                break;
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
        console.log('exitInstance', ctx)

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
};