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

            function init() {

            }
            
            init();
		};

		return new VarsModel();
    });
