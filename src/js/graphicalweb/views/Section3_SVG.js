/*global define, TWEEN, _log, $ */

define(['graphicalweb/events/UserEvent',
        'graphicalweb/events/StateEvent',
        'graphicalweb/controllers/CameraController',
        'graphicalweb/controllers/AudioController',
        'graphicalweb/models/VarsModel',
        'graphicalweb/views/components/Scenery',
        'graphicalweb/views/components/CharSvg',
        'graphicalweb/views/components/Div'],

	function (UserEvent, StateEvent, Camera, Audio, VarsModel, Scenery, SVG, Div) {
		
		var Section3_SVG = function () {
			var instance = this,
                stateId = 3,
                $blockquotes,
                $cover,
                svg,
                view;

            instance.phaselength = 0;
            instance.phase = 0;

//private
            
            function handle_animIn_COMPLETE() {
                StateEvent.SECTION_ANIM_IN_COMPLETE.dispatch(stateId);
                
                svg.start();
                if (VarsModel.PRESENTATION === true) {
                    instance.next();
                } else {
                    $(view + ':not(blockquote)').show();
                    svg.startSpin();
                    //svg.scale();
                }
            }

            function update() {
                if (VarsModel.DETAILS === true) {
                    svg.update();
                }
            }

//public
            instance.init = function () {
                
                view = '.section3';
                $blockquotes = $('blockquote' + view);
                               
                instance.phase = 0;
                instance.phaselength = $blockquotes.length;

                svg = new SVG('#charSVG');
                svg.unscale();

                if (VarsModel.BROWSER == 'firefox') {
                    $('#warning').fadeIn();
                }

                StateEvent.SECTION_READY.dispatch(stateId);
            };

            instance.update = function () {
                update(); 
            };

            instance.animIn = function (direct) {
                var goalPosition = {x: -2950, y: -768, z: 0},
                    divPosition = {x: 2700, y: 0, z: 0},
                    divRotation = {x: 0, y: 0, z: 0};

                if (direct) {
                    Camera.setPosition(goalPosition);
                    Camera.setRotation({x: 0, y: 0, z: 0});
                    Scenery.setParallax(0);
                    Div.setPosition(divPosition);
                    Div.setRotation(divRotation);

                    handle_animIn_COMPLETE();
                } else {
                    Camera.animateRotation({x: 0, y: 0, z: 0}, 2000);
                    Camera.animatePosition(goalPosition, 2000, {callback: handle_animIn_COMPLETE});
                    Scenery.animateParallax(0, 2000);
                    Div.animatePosition(divPosition, 2000);
                    Div.animateRotation(divRotation, 200);
                }
            };

            instance.run = function () {

                var $currentQuote = $($blockquotes[instance.phase - 1]);
                
                $blockquotes.fadeOut();

                switch (instance.phase) {
                case 1:
                    //interesting shape
                    StateEvent.AUTOMATING.dispatch();
                    svg.talk(false);
                    Div.setFace('talk');

                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        UserEvent.NEXT.dispatch();
                        Div.setFace('happy');
                    });
                    break;
                case 2:
                    //every shape
                    Div.setFace('happy');
                    svg.talk(true);

                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        UserEvent.NEXT.dispatch();
                        svg.talk(false);
                    });
                    break;
                case 3:
                    //wow vector graphics
                    svg.startSpin();
                    svg.talk(false);
                    Div.setFace('talk');

                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        UserEvent.NEXT.dispatch();
                        Div.setFace('happy');
                    });
                    break;
                case 4:
                    //scalable vector graphics
                    Div.setFace('happy');
                    svg.talk(true);
                    svg.unscale();

                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        svg.talk(false);
                        UserEvent.NEXT.dispatch();
                        svg.scale();
                    });
                    break;
                case 5:
                    //watch vector victor      
                    Div.setFace('talk');
                    svg.talk(false);
                    svg.scale();

                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        StateEvent.WAIT_FOR_INTERACTION.dispatch();                  
                        Div.setFace('happy');
                    });
                    break;
                case 6:
                    //more dimension
                    StateEvent.AUTOMATING.dispatch();
                    Div.setFace('talk');
                    svg.talk(false);

                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        UserEvent.NEXT.dispatch();
                        Div.setFace('happy');
                    });
                    break;
                case 7:
                    //three dimension
                    Div.setFace('happy');
                    svg.talk(true);
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        svg.talk(false);
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
                Audio.stopDialogue();
                svg.talk(false);
                svg.stopSpin();
                svg.unscale();
                svg.stop();
                $(view).hide();
                instance.destroy();
            };

            instance.destroy = function () {
                StateEvent.SECTION_DESTROY.dispatch();
            };
		};

		return new Section3_SVG();
    });
