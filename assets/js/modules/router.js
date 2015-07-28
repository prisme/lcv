var page = require('page');

// Import all views
var home = require('home');
var ateliers = require('list');
var spectacles = require('list');

var instances = {
    ateliers: ateliers,
    spectacles: spectacles,
};

exports.page = page;

exports.init = function(ROOT) {

    // Create enter and exit per view
    page('/', home.enter);
    page.exit('/', home.exit);

    page('/:list', function(ctx, next){
        console.log('enterInstance', ctx)
    });
    page.exit('/:list', exitInstance);

    function enterInstance(ctx, next) {
        console.log('enterInstance', ctx)
        
        var instance = false;

        switch(ctx.params.list) {
            case 'ateliers' :
                instance = ateliers;
                break;   
            case 'spectacles' :
                instance = spectacles;
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
        console.log(ctx)

        // instance won't exist for 404 pages, so skip to enter
        if (!ctx.instance) {
            next();
            return;
        }
        ctx.instance.exit(ctx, next);
    }

    // Activate page
    page.base(ROOT);
    page();
};