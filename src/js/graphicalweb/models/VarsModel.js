/*global define Modernizr*/
define([],

	function () {
		
		var VarsModel = function () {
			var instance = this;

            instance.PRESENTATION = false;  //presentation mode
            instance.ADOBE_BUILD = true;    //adobe's build
            instance.AUDIO = true;          //audio is supported
            instance.MUSIC = false;         //play music
            instance.DETAILS = true;        //support detail animations

		};

		return new VarsModel();
    });
