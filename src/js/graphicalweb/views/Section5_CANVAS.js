/*global define, TWEEN, _log, $ */

define(['graphicalweb/events/StateEvent',
        'graphicalweb/events/UserEvent',
        'graphicalweb/models/VarsModel',       
        'graphicalweb/controllers/CameraController',
        'graphicalweb/controllers/AudioController',
        'graphicalweb/views/components/CharCanvas',
        'graphicalweb/views/components/Div'],

	function (StateEvent, UserEvent, VarsModel, Camera, Audio, Canvas, Div) {
		
		var Section5_CANVAS = function () {
			var instance = this,
                stateId = 5,
                character,
                $blockquotes,
                $cover,
                view;

            instance.phaselength = 0;
            instance.phase = 0;

//private
            function handle_animIn_COMPLETE() {
                StateEvent.SECTION_ANIM_IN_COMPLETE.dispatch(stateId);

                if (VarsModel.PRESENTATION === true) {
                    instance.next();
                } else {
                    //TODO:: particles disperse around mouse
                    $(view + ':not(blockquote)').show();
                }
            }

//public
            instance.init = function () {
                view = '.section5';
                $blockquotes = $('blockquote' + view);
                               
                instance.phase = 0;
                instance.phaselength = $blockquotes.length;

                StateEvent.SECTION_READY.dispatch(stateId);
            };

            instance.animIn = function (direct) {
                var goalPosition = {x: -5090, y: 594, z: -4450},
                    goalRotation = {x: 7, y: -47, z: 0},
                //var goalPosition = {x: 790, y: 792, z: -7050},
                //    goalRotation = {x: 1, y: -55, z: 0},
                    divPosition = {x: 4800, y: -1450, z: 4300},
                    divRotation = {x: 0, y: 50, z: 0};

                if (direct) {
                    Camera.setPosition(goalPosition);  
                    Camera.setRotation(goalRotation);
                    Div.setPosition(divPosition);
                    Div.setRotation(divRotation);

                    handle_animIn_COMPLETE();
                } else {
                    Camera.animateRotation(goalRotation, 1000);
                    Camera.animatePosition(goalPosition, 1000, {easing: TWEEN.Easing.Quadratic.EaseInOut});
                    Div.animatePosition(divPosition, 2000, {easing: TWEEN.Easing.Sinusoidal.EaseIn});
                    Div.animateRotation(divRotation, 2000, {callback: handle_animIn_COMPLETE});
                }
            };

            instance.next = function () {
                var $currentQuote = $($blockquotes[instance.phase]);

                $blockquotes.fadeOut();

                switch (instance.phase) {
                case 0:
                    //pixels
                    StateEvent.AUTOMATING.dispatch();    
                    Canvas.talk();
                    Div.setFace('happy');                   
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        Canvas.face();
                        UserEvent.NEXT.dispatch();
                    });
                    break;
                case 1:
                    //woah
                    Div.setFace('talk');                   
                    Canvas.face();
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        Div.setFace('happy');
                        UserEvent.NEXT.dispatch();
                    });
                    break;
                case 2:
                    //canvas
                    Canvas.talk();
                    Div.setFace('happy');                   
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        Canvas.face();
                        StateEvent.WAIT_FOR_INTERACTION.dispatch();
                    });
                    break;
                case 3:
                    //spielberg
                    StateEvent.AUTOMATING.dispatch();         
                    Canvas.face();
                    Div.setFace('talk');                   
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        Div.setFace('happy');                   
                        UserEvent.NEXT.dispatch();
                    });
                    break;
                case 4:
                    //further
                    Div.setFace('happy');                   
                    Canvas.talk();
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        Canvas.face();
                        UserEvent.NEXT.dispatch();
                    });
                    break;
                case 5:
                    //weird
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
                $(view).hide();
                instance.destroy();
            };

            instance.destroy = function () {
                StateEvent.SECTION_DESTROY.dispatch();
            };
		};

		return new Section5_CANVAS();
    });
