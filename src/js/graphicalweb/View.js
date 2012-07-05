define(['graphicalweb/controllers/CameraController', 
        'graphicalweb/views/IntroView',
        'graphicalweb/events/StateEvent',
        'graphicalweb/views/HUD',
        'graphicalweb/views/components/Scenery',
        'graphicalweb/views/Section1_DIV',
        'graphicalweb/views/Section2_CSS',
        'graphicalweb/views/Section3_SVG'],

	function (Camera, IntroView, StateEvent, HUD, Scenery, Section1_DIV, Section2_CSS, Section3_SVG) {
		
		var View = function () {
			var instance = this,
                $preloader,
                currentSection,
                viewList = [
                    IntroView,
                    Section1_DIV,
                    Section2_CSS,
                    Section3_SVG
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

                //_log('gotosection:', section);

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
                viewList[currentSection].start();

                //TODO:: add scenery visibility in intro
                if (currentSection > 0) {
                    Scenery.init();
                }

                if (currentSection > 1) {
                    HUD.unlock(currentSection - 2);
                }

                if ($preloader.is(':visible')) {
                    $preloader.fadeOut();
                }

            }

            instance.init();
		};

		return View;
    });
