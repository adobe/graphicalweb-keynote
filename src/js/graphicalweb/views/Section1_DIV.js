/*global define, TWEEN, _log, $ */

define(['graphicalweb/events/UserEvent',
        'graphicalweb/events/StateEvent',
        'graphicalweb/models/VarsModel',
        'graphicalweb/controllers/CameraController',
        'graphicalweb/controllers/AudioController',
        'graphicalweb/views/components/Scenery',
        'graphicalweb/views/components/Div'],

	function (UserEvent, StateEvent, VarsModel, Camera, Audio, Scenery, Div) {
		
		var Section1_DIV = function () {
			var instance = this,
                stateId = 1,
                $blockquotes,
                $cover,
                view,
                timeout;

            instance.phaselength = 0;
            instance.phase = 0;

//private
            
            function handle_animIn_COMPLETE() {
                StateEvent.SECTION_ANIM_IN_COMPLETE.dispatch(stateId);
                Div.setFace('bored');

                if (VarsModel.PRESENTATION !== true) {
                    $(view + ':not(blockquote)').show();
                }
            }

            //blink text
            function blink(element) {
                var randomHex;

                function toggle() {
                    randomHex = '#' + Math.floor(Math.random() * 16777215).toString(16);
                    element.css({'color': randomHex});
                    element.toggle();
                    timeout = setTimeout(toggle, 100);
                }

                timeout = setTimeout(toggle, 100);
            }

            //type in text
            function typeInCopy(element) {
                var i = 0,
                    yes_copy = "<BLINK> Ready!!111! </BLINK>",
                    string = '';

                function type() {
                    string += yes_copy[i];
                    element.text(string);                    
                    if (i < yes_copy.length - 1) {
                        timeout = setTimeout(type, 100);
                    } else {
                        blink(element);
                        StateEvent.WAIT_FOR_INTERACTION.dispatch();
                    }
                    i += 1;
                }

                element.text(string);
                element.show();
                timeout = setTimeout(type, 100);
            }
            
//public
            instance.init = function () {
                                
                view = '.section1';
                $blockquotes = $('blockquote' + view);

                instance.phase = 0;
                instance.phaselength = $blockquotes.length;
                
                StateEvent.SECTION_READY.dispatch(stateId);
                StateEvent.WAIT_FOR_INTERACTION.dispatch();
            };

            instance.animIn = function (direct) {
                var goalPosition = {x: -650, y: -768, z: 0},
                    divPosition = {x: 800, y: 0, z: 0},
                    divRotation = {x: 0, y: 0, z: 0};                    

                $blockquotes.hide();

                if (direct) {
                    Camera.setPosition(goalPosition);
                    Scenery.setParallax(-200);
                    Div.setPosition(divPosition);
                    handle_animIn_COMPLETE();
                } else {
                    Camera.reset(2000);
                    Camera.animatePosition(goalPosition, 2000, {callback: handle_animIn_COMPLETE});
                    Scenery.animateParallax(-200, 2000);
                    Div.animatePosition(divPosition, 2000);
                    Div.animateRotation(divRotation, 200);                    
                }
            };

            /**
             * next sequence
             */
            instance.run = function () {

                var $currentQuote = $($blockquotes[instance.phase - 1]);

                $blockquotes.fadeOut();
                
                /*
                if ($currentQuote.data('audio') && VarsModel.SOUND !== false) {
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        UserEvent.NEXT.dispatch();
                    });
                } else {
                    $currentQuote.fadeIn();
                }
                */

                switch (instance.phase) {
                case 1: 
                    //YES!!
                    StateEvent.AUTOMATING.dispatch();
                    $currentQuote.fadeIn();
                    typeInCopy($currentQuote.find('b'));

                    Audio.playSFX('text_popup');
                    Audio.playSFX('text_typing');

                    Div.setFace('talk');
                    Camera.animateZoom({value: 1.5}, 1000, {easing: TWEEN.Easing.Quadratic.EaseIn});
                    break;
                case 2: 
                    //sorry
                    clearTimeout(timeout);
                    StateEvent.AUTOMATING.dispatch();
                    Div.setFace('talk');
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        StateEvent.WAIT_FOR_INTERACTION.dispatch();
                        Div.setFace('happy');
                    });
                    Camera.animateZoom({value: 1}, 1000, {easing: TWEEN.Easing.Quadratic.EaseOut});
                    break;
                case 3:
                    //you got it
                    StateEvent.AUTOMATING.dispatch();
                    Div.setFace('talk');
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        Div.setFace('happy');
                        UserEvent.NEXT.dispatch();
                    });

                    break;
                }
            };

            instance.prev = function () {
                instance.phase -= 1;
                instance.run();
            };

            instance.next = function () {
                instance.phase += 1;
                instance.run();
            };

            instance.stop = function () {
                clearTimeout(timeout);
                Div.setFace('happy');
                $(view).hide();
                instance.destroy();
            };

            instance.destroy = function () {
                StateEvent.SECTION_DESTROY.dispatch();
            };
		};

		return new Section1_DIV();
    });
