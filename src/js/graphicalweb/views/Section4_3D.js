/*global define, TWEEN, _log, $ */

define(['graphicalweb/events/UserEvent',
        'graphicalweb/events/StateEvent',
        'graphicalweb/models/VarsModel',
        'graphicalweb/controllers/CameraController',
        'graphicalweb/controllers/AudioController',
        'graphicalweb/views/components/Char3d',
        'graphicalweb/views/components/Div'],

	function (UserEvent, StateEvent, VarsModel, Camera, Audio, Moon, Div) {
		
		var Section4_3D = function () {
			var instance = this,
                stateId = 4,
                $blockquotes,
                $cover,
                view;

            instance.phaselength = 0;
            instance.phase = 0;

//private

            function handle_animIn_COMPLETE() {
                StateEvent.SECTION_ANIM_IN_COMPLETE.dispatch(stateId);

                Moon.start();
                if (VarsModel.PRESENTATION === true) {
                    instance.next();
                } else {
                    //TODO:: rotate to mouse
                    $(view + ':not(blockquote)').show();
                }
            }
                
            function update() {
                if (VarsModel.DETAILS === true) {
                    Moon.update();
                }
            }


//public
            instance.init = function (direct) {
                view = '.section4';
                $blockquotes = $('blockquote' + view);
                               
                instance.phase = 0;
                instance.phaselength = $blockquotes.length;

                //character = new Character();
                StateEvent.SECTION_READY.dispatch(stateId);
            };

            instance.animIn = function (direct) {
                var goalPosition = {x: -4990, y: 392, z: -4450},
                    goalRotation = {x: 1, y: -49, z: 0},
                //var goalPosition = {x: 810, y: 492, z: -6550},
                //    goalRotation = {x: 1, y: -55, z: 0},
                    divPosition = {x: 4880, y: -1320, z: 4300},
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
                    Div.animatePosition(divPosition, 1000, {easing: TWEEN.Easing.Sinusoidal.EaseInOut});
                    Div.animateRotation(divRotation, 2000, {callback: handle_animIn_COMPLETE});
                }
            };

            instance.update = function () {
                update();
            };

            instance.next = function () {
                var $currentQuote = $($blockquotes[instance.phase]);
                
                $blockquotes.fadeOut();

                switch (instance.phase) {
                case 0:
                    //mooned
                    Div.setFace('talk');                   
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        StateEvent.WAIT_FOR_INTERACTION.dispatch();
                        Div.setFace('happy');
                    });
                    break;
                case 1:
                    //z axis
                    StateEvent.AUTOMATING.dispatch();         
                    Div.setFace('happy');
                    Moon.talk(true);
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        Moon.talk(false);
                        UserEvent.NEXT.dispatch();
                    });
                    break;
                case 2:
                    //what does it all mean
                    Div.setFace('talk');
                    Moon.talk(false);
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        Div.setFace('happy');
                        UserEvent.NEXT.dispatch();
                    });
                    break;
                case 3:
                    //view things from every angle
                    Div.setFace('happy');
                    Moon.talk(true);
                    Moon.startRotation();
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        Moon.talk(false);
                        UserEvent.NEXT.dispatch();
                    });
                    break;
                case 4:
                    //hey i can see my house from  here                    
                    Div.setFace('talk');
                    Moon.talk(false);
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        UserEvent.NEXT.dispatch();
                        Moon.stopRotation();
                    });
                    break;
                case 5:
                    //dream big
                    Div.setFace('talk');
                    Moon.talk(false);
                    Moon.stopRotation();
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        Div.setFace('happy');
                        UserEvent.NEXT.dispatch();
                    });
                    break;
                }

                //$($blockquotes[instance.phase]).fadeIn();
                instance.phase += 1;
            };

            instance.stop = function () {
                Moon.stop();
                Moon.stopRotation();
                $(view).hide();
                instance.destroy();
            };

            instance.destroy = function () {
                StateEvent.SECTION_DESTROY.dispatch();
            };
		};

		return new Section4_3D();
    });
