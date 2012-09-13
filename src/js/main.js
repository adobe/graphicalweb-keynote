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

/**
 * check adobe build 
 */
function checkAdobeBuild() {
    return (navigator && navigator.userAgent.indexOf("Chrome/20.0.1123.0") != -1 && document && document.body && document.body.style.webkitAlphaCompositing !== undefined);
}

/**
*  detect os
*/
function detectOsName() {
    var os = "Unknown";
    if (navigator.platform.indexOf("Win") != -1) {
        os = "Windows";
    }
    if (navigator.platform.indexOf("Mac") != -1) {
        os = "Mac";
    }
    if (navigator.userAgent.indexOf("iPhone") != -1) {
        os = "iPhone";
    }
    return os;
}

/**
* check for features 
**/
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

/**
* determine if supported browser
*/
function checkForStatic() {
    var gostatic = true;

    //browser speciric
    if (checkAdobeBuild()) {
        gostatic = false;
    } else if (navigator.userAgent.indexOf('Chrome') > -1) {
        gostatic = false;
    } else if (navigator.userAgent.indexOf('Safari') > -1) {
        gostatic = false;
    } else if (navigator.userAgent.indexOf('Firefox') > -1) {
        gostatic = false;
    } else if (navigator.userAgent.indexOf('iPhone') > -1) {
        gostatic = false;
    } else if (navigator.userAgent.indexOf('MSIE') > -1) {
        gostatic = false;
    }

    //feature detection
    if (Modernizr.csstransforms3d !== true || 
         Modernizr.canvas !== true ||
         Modernizr.svg !== true ||
         Modernizr.inlinesvg !== true ||
         Modernizr.svgclippaths !== true) 
    {
        gostatic = true;
    }

    return gostatic;
}

/**
* js to run for static version
*/
function staticJS(static_html) {
    var $downloadBtn = $('.custom-build-btn'),
        $tryBtn = $('.try-btn'),
        $warning = $('#warning'),
        $popup = $('#popupHolder'),
        os = detectOsName(),
        downloadURL;

    //$('link[media="screen, projection"]').attr('href', 'css/static.css'); //crashes opera!!
    $('link[href="css/screen.css"]')[0].disabled = true;
    $('link[href="css/static.css"]')[0].disabled = false;
    $('body').prepend(static_html);

    $('#introTitle').attr('src', './assets/img/static/graphical_web_title.gif');
    $('.adobe-logo').attr('src', './assets/img/static/adobe_logo_standard.jpg');
    $('#warning img').attr('src', './assets/img/static/missingfeature.gif');

    $warning.show();
    $warning.bind('click', function () {
        $popup.show();
    });

    $tryBtn.text('View Static Page');
    $tryBtn.bind('click', function () {
        $popup.hide();
    });

    if (os == "Mac") {
        downloadURL = "https://github.com/downloads/adobe/webkit/PrototypeEnhancementsForChromiumMac-may2012-f2f.zip";
    } else if (os == "Windows") {
        downloadURL = "https://github.com/downloads/adobe/webkit/PrototypeEnhancementsForChromiumWin-may2012-f2f.zip";
    } else {
        downloadURL = 'javascript:alert("Unable to download custom browser on OS");';
    }
    $downloadBtn.attr('href', downloadURL);

    $('#preloader').hide();
}

/**
* start app or revert to static
*/
require(['graphicalweb/App', 'text!graphicalweb/views/html/static.html'], function (app, static_html) {
    _log('modernizr', Modernizr);

    var gostatic = checkForStatic();

    //only init app if meets minimum requirements otherwise...
    if (gostatic !== true) {
        app.init();
    } else {
        setTimeout(function () {
            staticJS(static_html);
        }, 1000);
    }
});
