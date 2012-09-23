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
                moon,
                $blockquotes,
                $cover,
                view;

            instance.phaselength = 0;
            instance.phase = 0;

//private

            function handle_animIn_COMPLETE() {
                StateEvent.SECTION_ANIM_IN_COMPLETE.dispatch(stateId);

                moon.start();
                if (VarsModel.PRESENTATION === true) {
                    instance.next();
                } else {
                    $(view + ':not(blockquote)').show();
                }
            }
                
            function update() {
                if (VarsModel.DETAILS === true) {
                    moon.update();
                }
            }

//public
            instance.init = function (direct) {
                view = '.section4';
                $blockquotes = $('blockquote' + view);
                
                //instance.talkingpoint = 0;
                //instance.talkingpoints = TALKING_POINTS[stateId - 2].length;

                instance.phase = 0;
                instance.phaselength = $blockquotes.length;

                moon = new Moon('#charTransform');

                StateEvent.SECTION_READY.dispatch(stateId);
            };

            instance.animIn = function (direct) {
                var goalPosition = {x: -5390, y: 790, z: -4550},
                    goalRotation = {x: 8, y: -51, z: 0},
                //var goalPosition = {x: 810, y: 492, z: -6550},
                //    goalRotation = {x: 1, y: -55, z: 0},
                    divPosition = {x: 4880, y: -1890, z: 4430},
                    divRotation = {x: 0, y: 90, z: 0};
                
                if (direct) {
                    Camera.setPosition(goalPosition);
                    Camera.setRotation(goalRotation);
                    Div.setPosition(divPosition);
                    Div.setRotation(divRotation);

                    handle_animIn_COMPLETE();
                } else {
                    Audio.playSFX('space_trans');

                    Camera.animateRotation(goalRotation, 1000);
                    Camera.animatePosition(goalPosition, 1000, {easing: TWEEN.Easing.Quadratic.EaseInOut});
                    Div.animatePosition(divPosition, 1000, {easing: TWEEN.Easing.Sinusoidal.EaseInOut});
                    Div.animateRotation(divRotation, 2000, {callback: handle_animIn_COMPLETE});
                }
            };

            instance.update = function () {
                update();
            };

            instance.run = function () {
                var $currentQuote = $($blockquotes[instance.phase - 1]);
                
                $blockquotes.fadeOut();

                switch (instance.phase) {
                case 1:
                    //mooned
                    Div.setFace('talk');                   
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        UserEvent.NEXT.dispatch();
                        Div.setFace('happy');
                    });
                    break;
                case 2:
                    //z axis
                    Div.setFace('happy');
                    moon.talk(true);
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        moon.talk(false);
                        UserEvent.NEXT.dispatch();
                    });
                    break;
                case 3:
                    //what does it all mean
                    Div.setFace('talk');
                    moon.talk(false);
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        Div.setFace('happy');
                        UserEvent.NEXT.dispatch();
                    });
                    break;
                case 4:
                    //view things from every angle
                    Div.setFace('happy');
                    moon.talk(true);
                    moon.startRotation();
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        moon.talk(false);
                        UserEvent.NEXT.dispatch();
                    });
                    break;
                case 5:
                    //hey i can see my house from  here                    
                    Div.setFace('talk');
                    moon.talk(false);
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        Div.setFace('happy');
                        moon.stopRotation();
                        StateEvent.WAIT_FOR_INTERACTION.dispatch();
                        //UserEvent.NEXT.dispatch();
                    });
                    break;
                case 6:
                    //dream big
                    StateEvent.AUTOMATING.dispatch();         
                    Div.setFace('talk');
                    moon.talk(false);
                    moon.stopRotation();
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

            //instance.talkingPoint = function () {
            //    var array = TALKING_POINTS[stateId - 2];
            //    runTalkPoint(array, instance);
            //};
            
            instance.stop = function () {
                Audio.stopDialogue();
                moon.stop();
                moon.stopRotation();
                $(view).hide();
                instance.destroy();
            };

            instance.destroy = function () {
                StateEvent.SECTION_DESTROY.dispatch();
            };
		};

		return new Section4_3D();
    });
