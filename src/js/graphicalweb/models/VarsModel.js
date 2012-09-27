/*global define Modernizr*/
define([],

	function () {
		
		var VarsModel = function () {
			var instance = this;

            instance.PRESENTATION = false;   //presentation mode
            instance.ADOBE_BUILD = true;    //adobe's build
            instance.CANARY = false;         //canary build
            instance.AUDIO = true;          //audio is supported
            instance.MUSIC = false;         //play music
            instance.DETAILS = true;        //support detail animations
            instance.BROWSER = '';          //browser name
            instance.OS = '';               //os name
            instance.FEATURES = [
                {name: 'css', enabled: true},
                {name: 'svg', enabled: true},
                {name: 'transforms', enabled: false},
                {name: 'canvas', enabled: false},
                {name: 'webgl', enabled: false},
                {name: 'blend', enabled: false},
                {name: 'shaders', enabled: false}
            ];
		};

		return new VarsModel();
    });
