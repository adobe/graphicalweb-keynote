/*global define Modernizr*/
define([],

	function () {
		
		var VarsModel = function () {
			var instance = this;

            instance.PRESENTATION = true;
            instance.ADOBE_BUILD = true;
            instance.SOUND = true;
            instance.SFX = true;
            instance.BG_SOUND = true;

            instance.support = {
                audio: true,
                svg: true,
                canvas: true,
                webgl: true
            };

            function init() {

            }
            
            init();
		};

		return new VarsModel();
    });
