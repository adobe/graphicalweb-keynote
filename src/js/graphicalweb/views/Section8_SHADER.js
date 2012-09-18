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
		
		var Section8_SHADER = function () {
			var instance = this,
                stateId = 8,
                shader,
                $cover,
                $blockquotes,
                $copy,
                copyTimeout,
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

            function showCopy() {
                $copy = $('<div id="shaderText">Vertex Distortion!</div>');
                $('#layer2').append($copy);
                setTimeout(function () {
                    $($copy).addClass('in');
                }, 100);
            }
            
//public
            instance.init = function (direct) {
                view = '.section8';
                $blockquotes = $('blockquote' + view);

                instance.phase = 0;
                instance.phaselength = $blockquotes.length;
    
                //if (VarsModel.ADOBE_BUILD !== true) {
                //    $('#warning').fadeIn();
                //}

                shader = new Shader();

                StateEvent.SECTION_READY.dispatch(stateId);
            };

            instance.update = function () {
                if (VarsModel.PRESENTATION !== true && VarsModel.ADOBE_BUILD === true) {
                    shader.update();
                }
            };

            instance.animIn = function (direct) {
                var goalPosition = {x: -1850, y: -768, z: 0},
                    goalRotation = {x: 0, y: 0, z: 0},
                    divPosition = {x: 1700, y: 0, z: 0},
                    divRotation = {x: 0, y: 0, z: 0};

                if (direct) {
                    Camera.reset(0);
                    Camera.setPosition(goalPosition);
                    Scenery.setParallax(200);
                    Div.setPosition(divPosition);
                    Div.setRotation(divRotation);
                    handle_animIn_COMPLETE();
                } else {
                    Camera.reset(1000);
                    Camera.animatePosition(goalPosition, 1000);
                    Scenery.animateParallax(200, 1000);
                    Div.animateRotation(divRotation, 2000);                    
                    Div.animatePosition(divPosition, 2000, {easing: TWEEN.Easing.Sinusoidal.EaseIn, callback: handle_animIn_COMPLETE});
                }
            };

            instance.run = function () {
                var $currentQuote = $($blockquotes[instance.phase - 1]);
                
                $blockquotes.fadeOut();
                
                switch (instance.phase) {
                case 1:
                    //welcome
                    Div.setFace('happy');
                    shader.talk(true);
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        shader.talk(false);
                        UserEvent.NEXT.dispatch();
                    });
                    break;
                case 2:
                    //what is this?
                    Div.setFace('talk');
                    shader.talk(false);
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        Div.setFace('happy');
                        UserEvent.NEXT.dispatch();
                    });
                    break;
                case 3:
                    //per vertex
                    Div.setFace('happy');
                    shader.talk(true);
                    //copyTimeout = setTimeout(showCopy, 1000);
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        StateEvent.WAIT_FOR_INTERACTION.dispatch();
                        shader.talk(false);
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
                clearTimeout(copyTimeout);
                Audio.stopDialogue();
                shader.stop();
                $(view).hide();
                instance.destroy();
            };

            instance.destroy = function () {
                StateEvent.SECTION_DESTROY.dispatch();
            };
		};

		return new Section8_SHADER();
    });
