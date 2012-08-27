/*global define $ TWEEN*/

define(['graphicalweb/events/StateEvent',
        'graphicalweb/events/UserEvent',
        'graphicalweb/controllers/CameraController',
        'graphicalweb/controllers/AudioController',
        'graphicalweb/models/VarsModel',
        'graphicalweb/views/components/CharShader',
        'graphicalweb/views/components/Div',
        'graphicalweb/views/components/Scenery'],

	function (StateEvent, UserEvent, Camera, Audio, VarsModel, Shader, Div, Scenery) {
		
		var Section9_PARADE = function () {
			var instance = this,
                stateId = 9,
                shader,
                $cover,
                $blockquotes,
                view;

            instance.phaselength = 0;
            instance.phase = 0;

//private
            function handle_animIn_COMPLETE() {
                StateEvent.SECTION_ANIM_IN_COMPLETE.dispatch(stateId);
                
                shader.start();

                if (VarsModel.PRESENTATION === true) {
                    instance.next();
                } else {
                    $(view + ':not(blockquote)').show();
                }
            }          
            
//public
            instance.init = function (direct) {
                view = '.section9';
                $blockquotes = $('blockquote' + view);

                shader = new Shader();

                instance.phase = 0;
                instance.phaselength = $blockquotes.length;

                StateEvent.SECTION_READY.dispatch(stateId);
            };

            instance.animIn = function (direct) {
                var goalPosition = {x: -3050, y: -768, z: 0},
                    divPosition = {x: 1700, y: 0, z: 0},
                    divRotation = {x: 0, y: 0, z: 0};

                if (direct) {
                    Camera.setPosition(goalPosition);
                    Scenery.setParallax(200);
                    Div.setPosition(divPosition);
                    Div.setRotation(divRotation);
                    handle_animIn_COMPLETE();
                } else {
                    Camera.animatePosition(goalPosition, 1000);
                    Scenery.animateParallax(200, 1000);
                    Div.animateRotation(divRotation, 2000);                    
                    Div.animatePosition(divPosition, 2000, {easing: TWEEN.Easing.Sinusoidal.EaseIn, callback: handle_animIn_COMPLETE});
                }
            };

            instance.next = function () {
                var $currentQuote = $($blockquotes[instance.phase]);
                
                $blockquotes.fadeOut();
                
                switch (instance.phase) {
                //case 0:
                //    //welcome
                //    Div.setFace('happy');
                //    shader.talk(true);
                //    Audio.playDialogue($currentQuote.data('audio'), function () {
                //        shader.talk(false);
                //        UserEvent.NEXT.dispatch();
                //    });
                //    break;
                //case 1:
                //    //what is this?
                //    Div.setFace('talk');
                //    shader.talk(false);
                //    Audio.playDialogue($currentQuote.data('audio'), function () {
                //        Div.setFace('happy');
                //        UserEvent.NEXT.dispatch();
                //    });
                //    break;
                //case 2:
                //    //all together
                //    Div.setFace('happy');
                //    shader.talk(true);
                //    Audio.playDialogue($currentQuote.data('audio'), function () {
                //        StateEvent.WAIT_FOR_INTERACTION.dispatch();
                //        shader.talk(false);
                //    });
                //    break;
                case 0:
                    //explore graphical web
                    StateEvent.AUTOMATING.dispatch();         
                    Div.setFace('happy');
                    shader.talk(true);
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        UserEvent.NEXT.dispatch();
                        shader.talk(false);
                    });
                    break;
                case 1:
                    //this is what i'm talking about
                    Div.setFace('talk');
                    shader.talk(false);
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        UserEvent.NEXT.dispatch();
                    });
                    break;
                case 2:
                    //let's get creative
                    Div.setFace('talk');
                    shader.talk(true);
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        Div.setFace('happy');
                        shader.talk(false);
                    });
                    break;
                }
                instance.phase += 1;
            };

            instance.stop = function () {
                shader.stop();
                $(view).hide();
                instance.destroy();
            };

            instance.destroy = function () {
                StateEvent.SECTION_DESTROY.dispatch();
            };
		};

		return new Section9_PARADE();
    });
