define(['graphicalweb/controllers/CameraController', 
        'graphicalweb/controllers/AudioController', 
        'graphicalweb/views/IntroView',
        'graphicalweb/events/StateEvent',
        'graphicalweb/views/HUD',
        'graphicalweb/views/components/Scenery',
        'graphicalweb/views/components/CharCanvas'],

        //TODO:: viewList should pull from model
	function (Camera, Audio, IntroView, StateEvent, HUD, Scenery, Canvas) {
		
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
                    Canvas.hide();
                    break;
                case 2:
                    Canvas.hide();
                    break;
                case 3:
                    Canvas.hide();
                    break;
                case 4:
                    Scenery.setState('3d');
                    Canvas.stars();
                    break;
                case 5:
                    Scenery.setState('3d');
                    Canvas.face();
                    break;
                case 6:
                    Scenery.setState('3d');
                    Canvas.hide();
                    break;
                case 7:
                    Scenery.setState('blend');
                    Canvas.hide();
                    break;
                case 8:
                    break;
                }

                viewList[currentSection].animIn();
            }

            /**
             * fired when animin finishes
             */
            function handle_ANIM_IN_COMPLETE(state) {
                switch (state) {
                case 1:
                    Scenery.setState();
                    //Scenery.removeAll();
                    break;
                case 2:
                    Scenery.setState('css');
                    //Scenery.addColor();
                    break;
                case 3:
                    Scenery.setState('svg');
                    //Scenery.addCurves();
                    break;
                case 4:
                    break;
                case 5:
                    break;
                case 6:
                    break;
                case 7:
                    break;
                }
            }
            
//public
			instance.init = function () {
                $preloader = $('#preloader');
                $cover = $('#cover');
                Camera.init();
                Audio.init();
                Scenery.init(); //only fire first time

                StateEvent.SECTION_READY.add(handle_SECTION_READY);
                StateEvent.SECTION_ANIM_IN_COMPLETE.add(handle_ANIM_IN_COMPLETE);
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
