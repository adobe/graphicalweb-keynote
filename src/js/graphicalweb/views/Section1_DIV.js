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
                view;

            instance.phaselength = 0;
            instance.phase = 0;

//private
            
            function handle_animIn_COMPLETE() {
                StateEvent.SECTION_ANIM_IN_COMPLETE.dispatch(stateId);
                $(view + ':not(blockquote)').show();
                Div.setFace('bored');
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
                    divPosition = {x: 800, y: 0, z: 0};

                $blockquotes.hide();

                if (direct) {
                    Camera.setPosition(goalPosition);
                    Div.setPosition(divPosition);
                    handle_animIn_COMPLETE();
                } else {
                    Camera.reset(2000);
                    Camera.animatePosition(goalPosition, 2000, {callback: handle_animIn_COMPLETE});
                    Scenery.animateParallax(-200, 2000);
                    Div.animatePosition(divPosition, 2000);
                }
            };

            /**
             * next sequence
             */
            instance.next = function () {

                var $currentQuote = $($blockquotes[instance.phase]);

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
                case 0: 
                    //YES!!
                    StateEvent.WAIT_FOR_INTERACTION.dispatch();
                    $currentQuote.fadeIn();
                    Div.setFace('talk');
                    Camera.animateZoom({value: 1.5}, 1000, {easing: TWEEN.Easing.Quadratic.EaseIn});
                    break;
                case 1: 
                    //sorry
                    StateEvent.AUTOMATING.dispatch();
                    Div.setFace('talk');
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        StateEvent.WAIT_FOR_INTERACTION.dispatch();
                        Div.setFace('happy');
                    });
                    Camera.animateZoom({value: 1}, 1000, {easing: TWEEN.Easing.Quadratic.EaseOut});
                    break;
                case 2:
                    StateEvent.AUTOMATING.dispatch();
                    Div.setFace('talk');
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        Div.setFace('happy');
                        UserEvent.NEXT.dispatch();
                    });

                    break;
                }

                instance.phase += 1;
            };

            instance.stop = function () {
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
