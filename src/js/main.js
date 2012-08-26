/*global require Modernizr console $*/
/*
 * Global Logging functions
 * Can be removed in the closure-compiler by passing "--define DEBUG=false"
 */

/** @define {boolean} */ 
var DEBUG = false;

/**
 * Wrapper for console log.  Could automatically removed in production build
 * @param {mixed...} items
 * @type {void}
 */
function _log(args) {
    if (DEBUG) {
        try {
            console.log.apply(console, arguments);
        } catch (e) {}
    }
}

//profile scripts
if (DEBUG) {
    try {
		console.profile();
	} catch (e) {}
}

/* check adobe build */
function checkAdobeBuild() {
    return (navigator && navigator.userAgent.indexOf("Chrome/20.0.1123.0") != -1 && document && document.body && document.body.style.webkitAlphaCompositing !== undefined);
}

require(['graphicalweb/App'], function (app) {
    _log('modernizr', Modernizr);
    
    //only init app if meets minimum requirements otherwise...
    if (Modernizr.csstransforms3d && checkAdobeBuild()) {
        app.init();
    } else {
        //use static
        _log('csstransform3d:', Modernizr.csstransforms3d);
        _log('adobebuild:', checkAdobeBuild());
        $('link[media="screen, projection"]').attr('href', 'css/static.css');
    }
});
