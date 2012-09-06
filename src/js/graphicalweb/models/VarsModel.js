/*global define Modernizr*/
define([],

	function () {
		
		var VarsModel = function () {
			var instance = this;

            instance.PRESENTATION = true;  //presentation mode
            instance.ADOBE_BUILD = true;    //adobe's build
            instance.AUDIO = true;          //audio is supported
            instance.MUSIC = false;         //play music
            instance.DETAILS = true;        //support detail animations
            instance.BROWSER = '';          //browser name

		};

		return new VarsModel();
    });
