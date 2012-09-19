/*global define $ TWEEN d3*/
define(['graphicalweb/events/StateEvent',
        'graphicalweb/events/UserEvent',
        'graphicalweb/controllers/CameraController',
        'graphicalweb/controllers/AudioController',
        'graphicalweb/models/VarsModel',
        'graphicalweb/views/components/CharBlend',
        'graphicalweb/views/components/Div',
        'graphicalweb/views/components/Scenery'],

	function (StateEvent, UserEvent, Camera, Audio, VarsModel, Blend, Div, Scenery) {
		
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
                $ghostcolor,
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
                ghost.start();
                ghost.fadeIn({'left': '1000px', 'opacity': '1'});
                $mistHolder.fadeIn();

                if (VarsModel.PRESENTATION === true) {
                    instance.next();
                } else {
                    $(view + ':not(blockquote)').show();
                    $ghostcolor = $('#BLEND-BLUE');
                }
            }

//public
            
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
                
                if (VarsModel.ADOBE_BUILD !== true) {
                    $('#warning').fadeIn();
                }

                ghost = new Blend('#charBlend');

                StateEvent.SECTION_READY.dispatch(stateId);
            };

            instance.update = function () {
            
            };

            instance.animIn = function (direct) {
                var goalPosition = {x: -650, y: -768, z: 0},
                    divPosition = {x: 600, y: 0, z: 0},
                    divRotation = {x: 0, y: 0, z: 0};

                if (direct) {
                    Camera.reset(0);
                    Camera.setPosition(goalPosition);
                    Scenery.setParallax(0);
                    Div.setPosition(divPosition);
                    Div.setRotation(divRotation);
                    handle_animIn_COMPLETE();
                } else {
                    Camera.reset(2000);
                    Camera.animatePosition(goalPosition, 1500, {easing: TWEEN.Easing.Sinusoidal.EaseOut, callback: handle_animIn_COMPLETE});
                    Scenery.animateParallax(0, 1000);
                    Div.animatePosition(divPosition, 1000);
                    Div.animateRotation(divRotation, 1000); 
                }
            };

           
            instance.run = function () {
                var $currentQuote = $($blockquotes[instance.phase - 1]);
                
                $blockquotes.fadeOut();
                
                switch (instance.phase) {
                case 1:
                    //amidead
                    StateEvent.AUTOMATING.dispatch();         
                    Div.setFace('talk');                   
                    ghost.talk(false);
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        Div.setFace('happy');
                        UserEvent.NEXT.dispatch();                        
                    });
                    break;
                case 2:
                    //dont be afraid
                    Div.setFace('happy');
                    ghost.talk(true);
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        //UserEvent.NEXT.dispatch();
                        ghost.talk(false);
                        StateEvent.WAIT_FOR_INTERACTION.dispatch();
                        UserEvent.SLIDE_IN.dispatch('7');
                    });
                    break;
                case 3:
                    //distortion?
                    StateEvent.AUTOMATING.dispatch();         
                    UserEvent.SLIDES_OUT.dispatch();
                    Div.setFace('talk');
                    ghost.talk(false);
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        Div.setFace('happy');
                        UserEvent.NEXT.dispatch();
                    });
                    break;
                case 4:
                    //princess another castle
                    Div.setFace('happy');
                    ghost.talk(true);
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        Div.setFace('talk');
                        ghost.talk(false);
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
                Div.setFace('happy');
                $(view).hide();
                ghost.fadeOut(function () {
                    ghost.stop();
                    instance.destroy();
                });
            };

            instance.destroy = function () {
                StateEvent.SECTION_DESTROY.dispatch();
            };
		};

		return new Section6_BLEND();
    });
