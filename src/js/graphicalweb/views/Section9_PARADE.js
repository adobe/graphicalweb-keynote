/*global define $ TWEEN*/

define(['graphicalweb/events/StateEvent',
        'graphicalweb/events/UserEvent',
        'graphicalweb/controllers/CameraController',
        'graphicalweb/controllers/AudioController',
        'graphicalweb/models/VarsModel',
        'graphicalweb/views/components/CharShader',
        'graphicalweb/views/components/CharCss',
        'graphicalweb/views/components/CharSvg',
        'graphicalweb/views/components/char3d',
        'graphicalweb/views/components/CharBlend',
        'graphicalweb/views/components/Div',
        'graphicalweb/views/components/Scenery'],

	function (StateEvent, UserEvent, Camera, Audio, VarsModel, Shader, CSS, SVG, Moon, Blend, Div, Scenery) {
		
		var Section9_PARADE = function () {
			var instance = this,
                stateId = 9,
                shader,
                moon,
                css,
                blend,
                svg,
                $cover,
                $blockquotes,
                view;

            instance.phaselength = 0;
            instance.phase = 0;

//private
            function handle_animIn_COMPLETE() {
                StateEvent.SECTION_ANIM_IN_COMPLETE.dispatch(stateId);
                
                if (VarsModel.DETAILS === true) {
                    shader.start();
                    svg.start();
                    css.start();
                    blend.start();
                    blend.fadeIn({'left': '0px', 'opacity': '1'});
                }

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

                //create duplicates of elements

                css = new CSS('#paradeCSS');
                svg = new SVG('#paradeSVG');
                //moon = new Moon();
                blend = new Blend('#paradeBlend');
                shader = new Shader();

                instance.phase = 0;
                instance.phaselength = $blockquotes.length;

                StateEvent.SECTION_READY.dispatch(stateId);
            };

            instance.update = function () {
                svg.update();
            };

            instance.animIn = function (direct) {
                var goalPosition = {x: -2450, y: -768, z: 0},
                    goalRotation = {x: 0, y: 0, z: 0},
                    divPosition = {x: 2500, y: 0, z: 0},
                    divRotation = {x: 0, y: 0, z: 0};

                if (direct) {
                    Camera.setPosition(goalPosition);
                    Scenery.setParallax(300);
                    Div.setPosition(divPosition);
                    Div.setRotation(divRotation);
                    handle_animIn_COMPLETE();
                } else {
                    Camera.animatePosition(goalPosition, 1000);
                    Scenery.animateParallax(300, 1000);
                    Div.animateRotation(divRotation, 2000);                    
                    Div.animatePosition(divPosition, 2000, {easing: TWEEN.Easing.Sinusoidal.EaseIn, callback: handle_animIn_COMPLETE});
                }
            };

            instance.next = function () {
                var $currentQuote = $($blockquotes[instance.phase]);
                
                $blockquotes.fadeOut();
                
                switch (instance.phase) {
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
                    shader.talk(false);
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        Div.setFace('happy');
                        shader.talk(false);
                    });
                    break;
                }
                instance.phase += 1;
            };

            instance.stop = function () {
                $(view).hide();
                blend.fadeOut(function () {
                    shader.stop();
                    blend.stop();
                    instance.destroy();
                });
            };

            instance.destroy = function () {
                StateEvent.SECTION_DESTROY.dispatch();
            };
		};

		return new Section9_PARADE();
    });
