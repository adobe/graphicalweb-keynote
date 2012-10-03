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
                    if (Camera.visible === false) {
                        Camera.show();
                        $('nav').show();
                    }
                    if ($cover.is(':visible')) {
                        $cover.delay(200).fadeOut();
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
                    if (VarsModel.PRESENTATION !== true) {
                        if (VarsModel.MUSIC === true) {
                            Audio.playBgLoop('title_mus_amb');
                        } else {
                            Audio.playBgLoop('park_amb_loop');
                        }
                    }
                    break;
                case 1:
                    Canvas.hide();
                    if (VarsModel.MUSIC === true) {
                        Audio.playBgLoop('main_mus_amb');
                    } else {
                        Audio.playBgLoop('park_amb_loop');
                    }
                    break;
                case 2:
                    Canvas.hide();
                    if (VarsModel.MUSIC === true) {
                        Audio.playBgLoop('main_mus_amb');
                    } else {
                        Audio.playBgLoop('park_amb_loop');
                    }
                    break;
                case 3:
                    Canvas.hide();
                    if (VarsModel.MUSIC === true) {
                        Audio.playBgLoop('main_mus_amb');
                    } else {
                        Audio.playBgLoop('park_amb_loop');
                    }
                    break;
                case 4:
                    Scenery.setState('3d');
                    if (VarsModel.OS !== 'iPhone' && VarsModel.OS !== 'iPad') {
                        Canvas.stars();  //issues on iOS
                    }
                    if (VarsModel.MUSIC === true) {
                        Audio.playBgLoop('space_mus_amb');
                    } else {
                        Audio.playBgLoop('space_amb_loop');
                    }
                    break;
                case 5:
                    Scenery.setState('3d');
                    if (VarsModel.OS !== 'iPhone' && VarsModel.OS !== 'iPad') {
                        Canvas.face();  //issues on iOS
                    }
                    Audio.playSFX('space_face');
                    if (VarsModel.MUSIC === true) {
                        Audio.playBgLoop('space_mus_amb');
                    } else {
                        Audio.playBgLoop('space_amb_loop');
                    }
                    break;
                case 6:
                    Scenery.setState('webgl');
                    Canvas.hide();
                    Audio.playBgLoop('space_form_loop');
                    break;
                case 7:
                    Scenery.rotate();
                    Canvas.hide();
                    if (VarsModel.MUSIC === true) {
                        Audio.playBgLoop('spooky_mus_amb');
                    } else {
                        Audio.playBgLoop('spooky_amb_loop');
                    }
                    break;
                case 8:
                    Canvas.hide();
                    if (VarsModel.MUSIC === true) {
                        Audio.playBgLoop('royal_mus_amb_1');
                    } else {
                        Audio.playBgLoop('park_amb_loop');
                    }
                    break;
                case 9:
                    Canvas.hide();
                    if (VarsModel.MUSIC === true) {
                        Audio.playBgLoop('parade_mus_amb');
                    } else {
                        Audio.playBgLoop('park_amb_loop');
                    }
                    break;
                }

                viewList[currentSection].animIn(firstvisit);
                firstvisit = currentSection === 0 ? true : false; //to prevent delay of div scene after intro
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
                case 4:
                    //Canvas.stars();  //for iOS performance
                    break;
                case 5:
                    Canvas.face();  //for iOS performance
                    Scenery.setState('canvas');
                    break;
                case 7:
                    Scenery.setState('blend');
                    break;
                case 8:
                    Scenery.setState('shader');
                    break;
                case 9:
                    Scenery.setState('shader');
                    break;
                }
            }

            function handle_ORIENTATIONCHANGE(e) {
                var viewport = $('meta[name="viewport"]'),
                    viewportValues,
                    scalableValues;

                switch (VarsModel.OS) {
                case 'iPhone':
                    if (Math.abs(window.orientation) == 90) {
                        viewportValues = 'width=960, height=640, initial-scale=0.5';
                    } else {
                        //portrait
                        viewportValues = 'width=600, height=800, initial-scale=0.5';
                    }
                    break;
                case 'iPad':
                    if (Math.abs(window.orientation) == 90) {
                        viewportValues = 'width=824, height=568, initial-scale=1.0';
                    } else {
                        //portrait
                        viewportValues = 'width=device-width, height=device-height, initial-scale=1.0';
                    }
                    break;
                }

                viewport.attr('content', viewportValues);
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
                HUD.init();

                StateEvent.SECTION_READY.add(handle_SECTION_READY);
                StateEvent.SECTION_ANIM_IN_COMPLETE.add(handle_ANIM_IN_COMPLETE);
                UserEvent.RESIZE.add(handle_RESIZE);
                UserEvent.ORIENTATIONCHANGE.add(handle_ORIENTATIONCHANGE);
                handle_ORIENTATIONCHANGE();

                //adjust things specific to browser/device
                //TODO:: perhaps move inside of characters that are relevant
                if (VarsModel.BROWSER == 'safari') {
                    Camera.setPerspective(5000);
                    $('.char-svg').css('webkitTransform', 'translateZ(0px)');
                } else if (VarsModel.BROWSER == 'ie') {
                    $('#charTransform').css('transform', 'translate3d(4800px, -1220px, 0px) rotateY(0deg) rotateX(-10deg)');
                }

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

                if (VarsModel.ADOBE_BUILD !== false || VarsModel.CANARY !== false) {
                    setTimeout(function () {
                        $('#popup-' + id).addClass('in');
                    }, 100);
                }            
            };

            instance.hidePanel = function () {
                
                if (VarsModel.ADOBE_BUILD !== false || VarsModel.CANARY !== false) {
                    $popups.removeClass('in');
                    setTimeout(function () {
                        $popupHolder.fadeOut();
                    }, 400);
                } else {
                    $popupHolder.fadeOut();
                }
            };

            instance.showMissingFeaturesAlert = function () {
                var downloadURL,
                    $downloadBtn = $('#popup-support .custom-build-btn'),
                    $popupSupportPanel = $('#popup-support'),
                    $tryBtn = $('#popup-support .try-btn');

                $popups.hide();
                $popupHolder.show();
                $popupSupportPanel.show();

                if (VarsModel.CANARY === true) {
                    $('#supportMsg2').show();
                } else {
                    $('#supportMsg1').show();
                }

                $tryBtn.bind('click', function () {
                    instance.hidePanel();
                    return false;
                });

                downloadURL = "https://tools.google.com/dlpage/chromesxs";
                if (VarsModel.OS == "Mac") {
                    //downloadURL = "https://github.com/downloads/adobe/webkit/PrototypeEnhancementsForChromiumMac-may2012-f2f.zip";
                } else if (VarsModel.OS == "Windows") {
                    //downloadURL = "https://github.com/downloads/adobe/webkit/PrototypeEnhancementsForChromiumWin-may2012-f2f.zip";
                } else {
                    downloadURL = 'javascript:alert("Unable to download custom browser on OS");';
                }
                
                $downloadBtn.attr('href', downloadURL);
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
