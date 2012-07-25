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

            /**
             * fired when secthin ready
             */
            function handle_SECTION_READY(state) {

                if ($preloader.is(':visible')) {
                    $preloader.fadeOut();
                }

                if (currentSection > 0) {
                    if ($cover.is(':visible')) {
                        $cover.fadeOut();
                    }

                    if (Camera.visible === false) {
                        Camera.show();
                        $('nav').show();
                    }
                }

                //TODO:: change when unlocked to inside
                if (currentSection > 1) {
                    HUD.unlock(currentSection - 2);
                }

                switch (state) {
                case 1:
                    break;
                case 2:
                    break;
                case 3:
                    break;
                case 4:
                    Scenery.addSpace();
                    break;
                }

                viewList[currentSection].animIn();
            }

            /**
             * fired when animin finishes
             */
            function handle_ANIMIN_COMPLETE(state) {
                switch (state) {
                case 1:
                    Scenery.removeAll();
                    break;
                case 2:
                    Scenery.addColor();
                    break;
                case 3:
                    Scenery.addCurves();
                    break;
                case 4:
                    break;
                }
            }
            
//public
			instance.init = function () {
                $preloader = $('#preloader');
                $cover = $('#cover');
                Camera.init();
                Scenery.init(); //only fire first time

                StateEvent.SECTION_READY.add(handle_SECTION_READY);
                StateEvent.SECTION_ANIM_IN_COMPLETE.add(handle_ANIMIN_COMPLETE);
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

                if (typeof(currentSection) !== 'undefined') {
                    //stop current section
                    currentSection = nextSection;
                    viewList[prevSection].stop();
                } else {
                    //first time visiting
                    currentSection = nextSection;
                    viewList[nextSection].init();
                    viewList[currentSection].animIn(true);
                }
            };

            /**
             * inits current section
             */
            instance.initSection = function () {
                viewList[currentSection].init();
            };

            instance.update = function () {
                Scenery.update();
            };

		};

		return View;
    });
