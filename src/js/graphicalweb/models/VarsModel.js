/*global define Modernizr*/
define([],

	function () {
		
		var VarsModel = function () {
			var instance = this;

            instance.PRESENTATION = false;  //presentation mode
            instance.ADOBE_BUILD = true;    //adobe's build
            instance.AUDIO = false;          //audio is supported

            function init() {

            }
            
            init();
		};

		return new VarsModel();
    });
