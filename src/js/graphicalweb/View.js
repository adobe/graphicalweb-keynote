define(['graphicalweb/controllers/CameraController', 
        'graphicalweb/views/IntroView',
        'graphicalweb/events/StateEvent',
        'graphicalweb/views/HUD',
        'graphicalweb/views/components/Scenery',
        'graphicalweb/views/Section1_DIV'],

	function (Camera, IntroView, StateEvent, HUD, Scenery, Section1_DIV) {
		
		var View = function () {
			var instance = this,
                $preloader,
                currentSection,
                viewList = [
                    IntroView,
                    Section1_DIV
                ];

//private
            
            
//public
			instance.init = function () {
                $preloader = $('#preloader');
            };

            /**
             * go to section
             * @param section - int
             */
            instance.gotoSection = function (section) {
                var nextSection = section,
                    prevSection = currentSection;

                _log('gotosection:', section);

                //if no previous section just add
                if (typeof(currentSection) !== 'undefined') {
                    currentSection = nextSection;
                    viewList[prevSection].stop();
                } else {
                    currentSection = nextSection;
                    viewList[nextSection].init();
                }
            };

            /**
             * inits current section
             */
            instance.initSection = function () {
                viewList[currentSection].init();
            };

            /**
             * start section
             */
            instance.startSection = function () {
                _log('SECTION READY', currentSection);

                viewList[currentSection].start();

                //TODO:: add scenery visibility in intro
                if (currentSection > 0) {
                    Scenery.init();
                }

                if ($preloader.is(':visible')) {
                    $preloader.fadeOut();
                }

            }

            instance.init();
		};

		return View;
    });
