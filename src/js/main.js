/*global require Modernizr console $*/
/*
 * Global Logging functions
 * Can be removed in the closure-compiler by passing "--define DEBUG=false"
 */

/** @define {boolean} */ 
var DEBUG = false,
    prefixes = ["", "-webkit-", "-moz-", "-ms-", "-o-"];


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

/* check for features */
function checkFeatureWithPropertyPrefix(property, value) {
    var div = $("<div />"),
        i, prefixedProperty;

    for (i = 0; i < this.prefixes.length; i += 1) {
        prefixedProperty = this.prefixes[i] + property;
        div.css(prefixedProperty, value);

        console.log('checking:', prefixedProperty, div.css(prefixedProperty), value);
        if (div.css(prefixedProperty, value).css(prefixedProperty) == value) {
            return true;
        }
    }
    return false;
}

require(['graphicalweb/App'], function (app) {
    _log('modernizr', Modernizr);
    
    //only init app if meets minimum requirements otherwise...
    //if (Modernizr.csstransforms3d && checkAdobeBuild()) {
    app.init();
    //} else {
    //    //use static
    //    _log('csstransform3d:', Modernizr.csstransforms3d);
    //    _log('adobebuild:', checkAdobeBuild());
        //$('link[media="screen, projection"]').attr('href', 'css/static.css');
    //}
});
