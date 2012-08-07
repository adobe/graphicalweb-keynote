/*global define, TWEEN, _log, $ */

define(['graphicalweb/events/UserEvent',
        'graphicalweb/events/StateEvent',
        'graphicalweb/controllers/CameraController',
        'graphicalweb/controllers/AudioController',
        'graphicalweb/models/VarsModel',
        'graphicalweb/views/components/Scenery',
        'graphicalweb/views/components/Div',
        'graphicalweb/views/components/CharCss'],

	function (UserEvent, StateEvent, Camera, Audio, VarsModel, Scenery, Div, Css) {
		
		var Section2_CSS = function () {
			var instance = this,
                stateId = 2,
                $blockquotes,
                $cover,
                view;
            
            instance.phaselength = 0;
            instance.phase = 0;

//private
            
            function handle_animIn_COMPLETE() {
                StateEvent.SECTION_ANIM_IN_COMPLETE.dispatch(stateId);
                $(view + ':not(blockquote)').show();
                Div.setFace('interested');
                
                Css.start();

                if (VarsModel.PRESENTATION === true) {
                    instance.next();
                }
            }
            
//public
            instance.init = function (direct) {
                
                view = '.section2';
                $blockquotes = $('blockquote' + view);

                instance.phase = 0;
                instance.phaselength = $blockquotes.length;

                StateEvent.SECTION_READY.dispatch(stateId);
            };

            instance.animIn = function (direct) {
                var goalPosition = {x: -1640, y: -768, z: 0},
                    divPosition = {x: 1700, y: 0, z: 0};

                if (direct) {
                    Camera.setPosition(goalPosition);
                    Div.setPosition(divPosition);
                    handle_animIn_COMPLETE();
                } else {
                    Camera.reset(3000);
                    Camera.animatePosition(goalPosition, 3000, {callback: handle_animIn_COMPLETE});
                    Scenery.animateParallax(-100, 3000);
                    Div.animatePosition(divPosition, 2000);
                }
            };

            instance.next = function () {

                var $currentQuote = $($blockquotes[instance.phase]);
                
                $blockquotes.fadeOut();
                
                /*
                if ($currentQuote.data('audio') && VarsModel.SOUND !== false) {
                    Audio.playDialogue($currentQuote.data('audio'));
                } else {
                    $currentQuote.fadeIn();
                }
                */

                switch (instance.phase) {
                case 0:
                    //hubba hubba
                    Css.talk = false;
                    Div.setFace('talk');                   
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        UserEvent.NEXT.dispatch();
                        Div.setFace('happy');
                    });
                    break;
                case 1:
                    //welcome to 1996
                    Css.talk = true;
                    Div.setFace('happy');                   
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        UserEvent.NEXT.dispatch();
                        //Css.talk = false;
                    });

                    break;
                case 2:
                    //about css
                    Css.talk = true;
                    Div.setFace('happy');                   
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        //UserEvent.NEXT.dispatch();
                        Css.talk = false;
                    });
                    break;
                case 3:
                    //made me better
                    Css.talk = false;
                    Div.setFace('talk');                   
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        UserEvent.NEXT.dispatch();
                        Div.setFace('happy');                   
                    });
                    break;
                case 4:
                    Css.talk = true;
                    Div.setFace('happy');                   
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        UserEvent.NEXT.dispatch();
                    });
                    break;
                case 5:
                    //out of system
                    Css.talk = true;
                    Div.setFace('happy');                   
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        UserEvent.NEXT.dispatch();
                        Css.talk = false;
                    });

                    break;
                }

                instance.phase += 1;
            };

            instance.stop = function () {
                Css.stop();
                $(view).hide();
                instance.destroy();
            };

            instance.destroy = function () {
                StateEvent.SECTION_DESTROY.dispatch();
            };
		};

		return new Section2_CSS();
    });
