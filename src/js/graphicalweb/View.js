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
                $popups,
                $popupHolder,
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
                if (currentSection > 1 && currentSection < 9) {
                    HUD.unlock(currentSection - 2);
                } else if (currentSection >= 9) {
                    HUD.unlock(6);
                }

                switch (state) {
                case 0:
                    Audio.playBgLoop('title_mus_amb');
                    break;
                case 1:
                    Canvas.hide();
                    Audio.playBgLoop('main_mus_amb');
                    break;
                case 2:
                    Canvas.hide();
                    Audio.playBgLoop('main_mus_amb');
                    break;
                case 3:
                    Canvas.hide();
                    Audio.playBgLoop('main_mus_amb');
                    break;
                case 4:
                    Scenery.setState('3d');
                    Canvas.stars();
                    Audio.playBgLoop('space_mus_amb');
                    break;
                case 5:
                    Scenery.setState('3d');
                    Canvas.face();
                    Audio.playSFX('space_face');
                    Audio.playBgLoop('space_mus_amb');
                    break;
                case 6:
                    Scenery.setState('webgl');
                    Canvas.hide();
                    Audio.playBgLoop('space_form_loop');
                    break;
                case 7:
                    Scenery.setState('blend');
                    Canvas.hide();
                    Audio.playBgLoop('spooky_mus_amb');
                    break;
                case 8:
                    Canvas.hide();
                    Audio.playBgLoop('royal_mus_amb_1');
                    break;
                case 9:
                    Canvas.hide();
                    Audio.playBgLoop('parade_mus_amb');
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

                    if (currentSection > 1) {
                        $keyleft.fadeIn();
                    }
                    if (currentSection < 9) {
                        $keyright.fadeIn();
                        $infobtn.fadeIn();
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
                    Audio.playSFX('mountains');
                    break;
                case 7:
                    break;
                case 8:
                    Scenery.setState('shader');
                    break;
                case 9:
                    Scenery.setState('shader');
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
                $popups = $('.popup');
                $popupHolder = $('#popupHolder');

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

                if (typeof(currentSection) !== 'undefined') {
                    //stop current section
                    currentSection = nextSection;
                    viewList[prevSection].stop();
                } else {
                    //first time visiting
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

            instance.showPanel = function () {
                var id = currentSection;
                
                $popups.hide();
                $popupHolder.fadeIn();
                $('#popup-' + id).show();

                if (VarsModel.ADOBE_BUILD !== false) {
                    setTimeout(function () {
                        $('#popup-' + id).addClass('in');
                    }, 100);
                }            
            };

            instance.hidePanel = function () {
                
                if (VarsModel.ADOBE_BUILD !== false) {
                    $popups.removeClass('in');
                    setTimeout(function () {
                        $popupHolder.fadeOut();
                    }, 400);
                } else {
                    $popupHolder.fadeOut();
                }
            };

            instance.showMissingFeaturesAlert = function () {
                $popups.hide();
                $popupHolder.show();
                $('#popup-support').show();

                $('#popup-support .try-btn').bind('click', function () {
                    instance.hidePanel();
                    return false;
                });
            };

            /*
             * update based on requestanim
             * TODO:: add div update
             */
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
