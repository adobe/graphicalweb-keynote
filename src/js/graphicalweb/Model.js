/*global define $ checkAdobeBuild checkCanary detectOsName*/

define(['graphicalweb/views/IntroView',
        'graphicalweb/models/VarsModel',
        'graphicalweb/controllers/CameraController',
        'graphicalweb/views/Section1_DIV',
        'graphicalweb/views/Section2_CSS',
        'graphicalweb/views/Section3_SVG',
        'graphicalweb/views/Section4_3D',
        'graphicalweb/views/Section5_CANVAS',
        'graphicalweb/views/Section6_WEBGL',
        'graphicalweb/views/Section7_BLEND',
        'graphicalweb/views/Section8_SHADER',
        'graphicalweb/views/Section9_PARADE'],

	function (IntroView, 
        VarsModel,
        Camera,
        Section1_DIV, 
        Section2_CSS, 
        Section3_SVG,
        Section4_3D,
        Section5_CANVAS,
        Section6_WEBGL,
        Section7_BLEND,
        Section8_SHADER,
        Section9_PARADE) {
		
		var Model = function () {
			var instance = this,
            currentState,
            states = [
                {id: 0, title: 'Intro', url: '/', view: IntroView},
                {id: 1, title: 'Div', url: 'meet-div', view: Section1_DIV}, 
                {id: 2, title: 'CSS', url: 'meet-css', view: Section2_CSS},
                {id: 3, title: 'SVG', url: 'meet-svg', view: Section3_SVG},
                {id: 4, title: '3D', url: 'meet-3d', view: Section4_3D},
                {id: 5, title: 'Canvas', url: 'meet-canvas', view: Section5_CANVAS},
                {id: 6, title: 'WebGL', url: 'meet-webgl', view: Section6_WEBGL},
                {id: 7, title: 'Blend Modes', url: 'meet-blend', view: Section7_BLEND},
                {id: 8, title: 'Custom Filters', url: 'meet-custom-filters', view: Section8_SHADER},
                {id: 9, title: 'Parade', url: 'meet-all', view: Section9_PARADE}
            ];

            instance.TITLE = '';

//private


            /**
             *  check useragent vars
             */
            function checkVars() {
                var useragent;
                useragent = navigator.userAgent;

                VarsModel.OS = detectOsName();
                VarsModel.ADOBE_BUILD = checkAdobeBuild();
                VarsModel.CANARY = checkCanary();

                if (VarsModel.ADOBE_BUILD !== false) {
                    $('html').addClass('adobe');
                }

                if (VarsModel.CANARY !== false) {
                    $('html').addClass('adobe');
                    $('html').addClass('canary');
                }

                if (useragent.indexOf('iPhone') > -1 || useragent.indexOf('iPad') > -1) {
                    //mobile safari
                    VarsModel.AUDIO = false;
                    VarsModel.DETAILS = false;
                    VarsModel.BROWSER = 'safari';
                } else if (useragent.indexOf('Safari') > -1 && useragent.indexOf('Chrome') === -1) {
                    //desktop safari
                    VarsModel.DETAILS = false;
                    VarsModel.BROWSER = 'safari';
                } else if (useragent.indexOf('Firefox') > -1) {
                    //firefox
                    VarsModel.DETAILS = false;
                    VarsModel.BROWSER = 'firefox';
                } else if (navigator.userAgent.indexOf('MSIE') > -1) {
                    VarsModel.DETAILS = false;
                    VarsModel.BROWSER = 'ie';
                }
            }
         
//public
			instance.init = function () {
                instance.TITLE = $('title').text();
                checkVars();
            };

            /**
             * get list of views
             * @return list Array
             */
            instance.getViewList = function () {
                var list = [],
                    i = 0;

                for (i; i < states.length; i += 1) {
                    list.push(states[i].view);
                }

                return list;
            };

            /**
             * get state by title
             * @param title String
             * @return state Object
             */
            instance.getStateByTitle = function (t) {
                var i = 0;
                for (i; i < states.length; i += 1) {
                    if (states[i].title == t) {
                        return states[i];
                    }
                }
            };

            /**
             * @param url String
             * @return state Object
             */
            instance.getStateByURL = function (url) {
                var i = 0;
                for (i; i < states.length; i += 1) {
                    if (states[i].url == url) {
                        return states[i];
                    }
                }
            };

            /**
             * get state by section
             * @param num int
             * @return state Object
             */
            instance.getStateByInt = function (num) {
                return states[num];
            };

            /**
             * @return state Object
             */
            instance.getCurrentState = function () {
                return states[currentState];
            };

            /**
             * @return states Array
             */
            instance.getStates = function () {
                return states;
            };

            /**
             * @param newState int
             */
            instance.setCurrentState = function (newState) {
                currentState = newState;
            };

            instance.init();
		};

		return Model;
    });
