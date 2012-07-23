define(['graphicalweb/controllers/CameraController', 
        'graphicalweb/views/IntroView',
        'graphicalweb/events/StateEvent',
        'graphicalweb/views/HUD',
        'graphicalweb/views/components/Scenery'],

        //TODO:: viewList should pull from model
	function (Camera, IntroView, StateEvent, HUD, Scenery) {
		
		var View = function () {
			var instance = this,
                $preloader,
                $cover,
                currentSection,
                viewList;

//private
            
            
//public
			instance.init = function () {
                $preloader = $('#preloader');
                $cover = $('#cover');
                Camera.init();
                Scenery.init(); //only fire first time
            };

            instance.setViewList = function (list) {
                viewList = list;
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

                //_log('ok...', currentSection, $cover.is(':visible'));
                if (currentSection > 0 && $cover.is(':visible')) {
                    $cover.fadeOut();
                }

                //viewList[currentSection].start();

                if (currentSection > 0 && Camera.visible === false) {
                    Camera.show();
                    $('nav').show();
                }

                //TODO:: change when unlocked to inside
                if (currentSection > 1) {
                    HUD.unlock(currentSection - 2);
                }

                if ($preloader.is(':visible')) {
                    $preloader.fadeOut();
                }

            }

		};

		return View;
    });
