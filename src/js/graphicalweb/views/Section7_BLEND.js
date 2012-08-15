/*global define $ TWEEN d3*/
define(['graphicalweb/events/StateEvent',
        'graphicalweb/events/UserEvent',
        'graphicalweb/controllers/CameraController',
        'graphicalweb/controllers/AudioController',
        'graphicalweb/models/VarsModel',
        'graphicalweb/views/components/CharBlend',
        'graphicalweb/views/components/Div',
        'graphicalweb/views/components/Scenery'],

	function (StateEvent, UserEvent, Camera, Audio, VarsModel, Character, Div, Scenery) {
		
		var Section6_BLEND = function () {
			var instance = this,
                stateId = 7,
                ghost,
                interval,
                delta = 0,
                $cover,
                $blockquotes,
                $mistHolder,
                $lightning,
                LIGHTNING_TIMEOUT,
                view;

            instance.phaselength = 0;
            instance.phase = 0;

//private

            function flash() {
                $lightning.show();
                $lightning.fadeOut(200, function () {
                    LIGHTNING_TIMEOUT = setTimeout(flash, 100 + 10000 * Math.random());
                });
            }

            function handle_animIn_COMPLETE() {
                StateEvent.SECTION_ANIM_IN_COMPLETE.dispatch(stateId);
                ghost.fadeIn();
                $mistHolder.fadeIn();
                
                if (VarsModel.PRESENTATION === true) {
                    instance.next();
                } else {
                    $(view + ':not(blockquote)').show();
                }

                if (VarsModel.DETAILS === true) {
                    LIGHTNING_TIMEOUT = setTimeout(flash, 100);
                }
            }

//public

            instance.update = function () {
                if (VarsModel.DETAILS === true) {
                    delta += 1;
                    $mistHolder.css({'backgroundPosition': -delta + 'px' + ' 0px'});
                }
            }
            
            instance.init = function () {
                var mist,
                    randompath,
                    i;

                view = '.section7';
                $blockquotes = $('blockquote' + view);
                $mistHolder = $('#mistHolder');
                $lightning = $('#lightning');
                
                instance.phase = 0;
                instance.phaselength = $blockquotes.length;
                
                ghost = new Character();

                StateEvent.SECTION_READY.dispatch(stateId);
            };

            instance.animIn = function (direct) {
                var goalPosition = {x: -650, y: -768, z: 0},
                    divPosition = {x: 800, y: 0, z: 0},
                    divRotation = {x: 0, y: 0, z: 0};

                if (direct) {
                    Camera.setPosition(goalPosition);
                    Scenery.setParallax(0);
                    Div.setPosition(divPosition);
                    Div.setRotation(divRotation);
                    handle_animIn_COMPLETE();
                } else {
                    Camera.reset(2000);
                    Camera.animatePosition(goalPosition, 1000);
                    Scenery.animateParallax(0, 1000);
                    Div.animatePosition(divPosition, 1000, {callback: handle_animIn_COMPLETE});
                    Div.animateRotation(divRotation, 1000); 
                }
            };

           
            instance.next = function () {
                var $currentQuote = $($blockquotes[instance.phase]);
                
                $blockquotes.fadeOut();
                
                switch (instance.phase) {
                case 0:
                    //amidead
                    StateEvent.AUTOMATING.dispatch();         
                    Div.setFace('talk');                   
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        Div.setFace('happy');
                        UserEvent.NEXT.dispatch();                        
                    });
                    break;
                case 1:
                    //dont be afraid
                    Div.setFace('happy');
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        UserEvent.NEXT.dispatch();
                    });
                    break;
                case 2:
                    //take that
                    Div.setFace('happy');
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        StateEvent.WAIT_FOR_INTERACTION.dispatch();
                    });
                    break;
                case 3:
                    //distortion?
                    StateEvent.AUTOMATING.dispatch();         
                    Div.setFace('talk');
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        Div.setFace('happy');
                        UserEvent.NEXT.dispatch();
                    });
                    break;
                case 4:
                    //princess another castle
                    Div.setFace('happy');
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        UserEvent.NEXT.dispatch();
                    });
                    break;
                }
                
                instance.phase += 1;
            };

            instance.stop = function () {
                Div.setFace('happy');
                $lightning.stop().hide();
                clearTimeout(LIGHTNING_TIMEOUT);
                ghost.fadeOut();
                $mistHolder.fadeOut(200, function () {
                    instance.destroy();
                });
            };

            instance.destroy = function () {
                //if (VarsModel.DETAILS === true) {
                //    clearInterval(interval);
                //}
                
                StateEvent.SECTION_DESTROY.dispatch();
            };
		};

		return new Section6_BLEND();
    });
