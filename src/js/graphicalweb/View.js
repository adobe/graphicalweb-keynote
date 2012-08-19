/*global $ define*/
define(['graphicalweb/controllers/CameraController', 
        'graphicalweb/controllers/AudioController', 
        'graphicalweb/views/IntroView',
        'graphicalweb/models/VarsModel',
        'graphicalweb/events/StateEvent',
        'graphicalweb/events/UserEvent',
        'graphicalweb/views/HUD',
        'graphicalweb/views/components/Scenery',
        'graphicalweb/views/components/CharCanvas'],

        //TODO:: viewList should pull from model
	function (Camera, Audio, IntroView, VarsModel, StateEvent, UserEvent, HUD, Scenery, Canvas) {
		
		var View = function () {
			var instance = this,
                $preloader,
                $cover,
                $infobtn,
                $keyright,
                $keyleft,
                currentSection,
                firstvisit = true,
                viewList;

//private

            /**
             * fired when secthin ready
             */
            function handle_SECTION_READY(state) {

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
                case 0:
                    Audio.playBgLoop('theme_v1');
                    break;
                case 1:
                    Canvas.hide();
                    Audio.playBgLoop('theme_v1');
                    break;
                case 2:
                    Canvas.hide();
                    Audio.playBgLoop('theme_v1');
                    break;
                case 3:
                    Canvas.hide();
                    Audio.playBgLoop('theme_v1');
                    break;
                case 4:
                    Scenery.setState('3d');
                    Canvas.stars();
                    Audio.playBgLoop('space_v1');
                    break;
                case 5:
                    Scenery.setState('3d');
                    Canvas.face();
                    Audio.playBgLoop('space_v1');
                    break;
                case 6:
                    Scenery.setState('webgl');
                    Canvas.hide();
                    Audio.playBgLoop('space_v1');
                    break;
                case 7:
                    Scenery.setState('blend');
                    Canvas.hide();
                    Audio.playBgLoop('theme_v1');
                    break;
                case 8:
                    Scenery.setState('shader');
                    Canvas.hide();
                    Audio.playBgLoop('theme_v1');
                    break;
                }

                viewList[currentSection].animIn(firstvisit);
                firstvisit = false;
            }

            /**
             * fired when animin finishes
             */
            function handle_ANIM_IN_COMPLETE(state) {

                if (VarsModel.PRESENTATION !== true) {
                    $infobtn.fadeIn();

                    if (currentSection > 1) {
                        $keyleft.fadeIn();
                    }

                    if (currentSection < 8) {
                        $keyright.fadeIn();
                    }
                }
                
                switch (state) {
                case 1:
                    Scenery.setState();
                    break;
                case 2:
                    Scenery.setState('css');
                    break;
                case 3:
                    Scenery.setState('svg');
                    break;
                }
            }

            function handle_RESIZE() {
                Canvas.resize();
            }

            function handle_AUTOMATING() {
                $keyright.fadeOut();
            }

            function handle_WAIT_FOR_INTERACTION() {
                $keyright.fadeIn();
            }
            
//public
			instance.init = function () {
                $preloader = $('#preloader');
                $cover = $('#cover');
                $infobtn = $('#info-btn');
                $keyright = $('#key-right');
                $keyleft = $('#key-left');

                Camera.init();
                Audio.init();
                Scenery.init(); //only fire first time

                StateEvent.SECTION_READY.add(handle_SECTION_READY);
                StateEvent.SECTION_ANIM_IN_COMPLETE.add(handle_ANIM_IN_COMPLETE);
                UserEvent.RESIZE.add(handle_RESIZE);

                if (VarsModel.PRESENTATION === true) {
                    StateEvent.AUTOMATING.add(handle_AUTOMATING);
                    StateEvent.WAIT_FOR_INTERACTION.add(handle_WAIT_FOR_INTERACTION);
                } else {
                    $('#utils').show();
                }
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

                if (VarsModel.PRESENTATION === false) {
                    $infobtn.fadeOut();
                    $('.key-btn').fadeOut();
                }

                _log('currentsection defined??', currentSection);
                if (typeof(currentSection) !== 'undefined') {
                    //stop current section
                    currentSection = nextSection;
                    viewList[prevSection].stop();
                } else {
                    //first time visiting
                    currentSection = nextSection;
                    viewList[nextSection].init();
                    //firstvisit = true;
                    //viewList[currentSection].animIn(true);
                }
            };

            /**
             * inits current section
             */
            instance.initSection = function () {
                viewList[currentSection].init();
            };

            instance.showPanel = function () {
                //TODO:: show panel

                var id = currentSection;
                $('.popup').hide();
                $('#popup-' + id).show();
                $('#popupHolder').show();
            };

            instance.hidePanel = function () {
                $('#popupHolder').hide();
            };

            instance.update = function () {
                Scenery.update();
                try {
                    viewList[currentSection].update();
                } catch (e) {
                    //_log('no update for', currentSection);
                }
            };

		};

		return View;
    });
