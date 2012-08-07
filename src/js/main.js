/*global require Modernizr console*/
/*
 * Global Logging functions
 * Can be removed in the closure-compiler by passing "--define DEBUG=false"
 */

/** @define {boolean} */ 
var DEBUG = true;

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

require(['graphicalweb/App'], function (app) {

    //only init app if meets minimum requirements otherwise...
    if (Modernizr.csstransforms3d) {
        app.init();
    } else {
        _log('no csstransform3d');
    }
});
