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
                view;

            instance.phaselength = 0;
            instance.phase = 0;

//private
            
            function handle_animIn_COMPLETE() {
                StateEvent.SECTION_ANIM_IN_COMPLETE.dispatch(stateId);
                
                SVG.start();
                if (VarsModel.PRESENTATION === true) {
                    instance.next();
                } else {
                    $(view + ':not(blockquote)').show();
                    SVG.startSpin();
                    SVG.scale();
                }
            }

            function update() {
                if (VarsModel.DETAILS === true) {
                    SVG.update();
                }
            }

//public
            instance.init = function () {
                
                view = '.section3';
                $blockquotes = $('blockquote' + view);
                               
                instance.phase = 0;
                instance.phaselength = $blockquotes.length;

                SVG.unscale();

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

            instance.next = function () {

                var $currentQuote = $($blockquotes[instance.phase]);
                
                $blockquotes.fadeOut();

                switch (instance.phase) {
                case 0:
                    //interesting shape
                    StateEvent.AUTOMATING.dispatch();
                    SVG.talk(false);
                    Div.setFace('talk');                   
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        UserEvent.NEXT.dispatch();
                        Div.setFace('happy');
                    });
                    break;
                case 1:
                    //every shape
                    Div.setFace('happy');
                    SVG.talk(true);
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        UserEvent.NEXT.dispatch();
                        SVG.talk(false);
                    });
                    break;
                case 2:
                    //wow vector graphics
                    SVG.startSpin();
                    SVG.talk(false);
                    Div.setFace('talk');
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        UserEvent.NEXT.dispatch();
                        Div.setFace('happy');
                    });
                    break;
                case 3:
                    //scalable vector graphics
                    Div.setFace('happy');
                    SVG.talk(true);
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        SVG.talk(false);
                        UserEvent.NEXT.dispatch();
                        SVG.scale();
                    });
                    break;
                case 4:
                    //watch vector victor      
                    Div.setFace('talk');
                    SVG.talk(false);
                    SVG.scale();
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        StateEvent.WAIT_FOR_INTERACTION.dispatch();                  
                        Div.setFace('happy');
                    });
                    break;
                case 5:
                    //more dimension
                    StateEvent.AUTOMATING.dispatch();
                    Div.setFace('talk');
                    SVG.talk(false);
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        UserEvent.NEXT.dispatch();
                        Div.setFace('happy');
                    });
                    break;
                case 6:
                    //three dimension
                    Div.setFace('happy');
                    SVG.talk(true);
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        SVG.talk(false);
                        UserEvent.NEXT.dispatch();
                    });
                    break;
                }

                instance.phase += 1;
            };

            instance.stop = function () {
                SVG.talk(false);
                SVG.stopSpin();
                SVG.unscale();
                SVG.stop();
                $(view).hide();
                instance.destroy();
            };

            instance.destroy = function () {
                StateEvent.SECTION_DESTROY.dispatch();
            };
		};

		return new Section3_SVG();
    });
