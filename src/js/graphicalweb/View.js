define(['graphicalweb/controllers/CameraController', 
        'graphicalweb/views/IntroView',
        'graphicalweb/events/StateEvent',
        'graphicalweb/views/HUD',
        'graphicalweb/views/components/Scenery',
        'graphicalweb/views/Section1_DIV',
        'graphicalweb/views/Section2_CSS',
        'graphicalweb/views/Section3_SVG',
        'graphicalweb/views/Section4_3D'],

        //TODO:: viewList should pull from model
	function (Camera, IntroView, StateEvent, HUD, Scenery, Section1_DIV, Section2_CSS, Section3_SVG, Section4_3D) {
		
		var View = function () {
			var instance = this,
                $preloader,
                currentSection,
                viewList = [
                    IntroView,
                    Section1_DIV,
                    Section2_CSS,
                    Section3_SVG,
                    Section4_3D
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
                    viewList[nextSection].init(true);
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

                if (currentSection > 0 && Scenery.initted === false) {
                    Scenery.init(); //only fire first time
                }

                //TODO:: change when unlocked to inside
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
