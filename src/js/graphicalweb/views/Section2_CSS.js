/*global define, TWEEN, _log, $ */

define(['graphicalweb/events/StateEvent',
        'graphicalweb/controllers/CameraController',
        'graphicalweb/controllers/AudioController',
        'graphicalweb/models/VarsModel',
        'graphicalweb/views/components/Scenery',
        'graphicalweb/views/components/Div',
        'graphicalweb/views/components/CharCss'],

	function (StateEvent, Camera, Audio, VarsModel, Scenery, Div, Css) {
		
		var Section2_CSS = function () {
			var instance = this,
                stateId = 2,
                $blockquotes,
                $cover,
                view;
            
            instance.phaselength = 0;
            instance.phase = 0;

//private
            
            function handle_animIn_COMPLETE() {
                StateEvent.SECTION_ANIM_IN_COMPLETE.dispatch(stateId);
                $(view + ':not(blockquote)').show();
                Div.setFace('interested');
                
                Css.start();
            }
            
//public
            instance.init = function (direct) {
                
                view = '.section2';
                $blockquotes = $('blockquote' + view);

                instance.phase = 0;
                instance.phaselength = $blockquotes.length;

                StateEvent.SECTION_READY.dispatch(stateId);
            };

            instance.animIn = function (direct) {
                var goalPosition = {x: -1640, y: -768, z: 0},
                    divPosition = {x: 1700, y: 0, z: 0};

                if (direct) {
                    Camera.setPosition(goalPosition);
                    Div.setPosition(divPosition);
                    handle_animIn_COMPLETE();
                } else {
                    Camera.reset(3000);
                    Camera.animatePosition(goalPosition, 3000, {callback: handle_animIn_COMPLETE});
                    Scenery.animateParallax(-100, 3000);
                    Div.animatePosition(divPosition, 2000);
                }
            };

            instance.next = function () {

                var $currentQuote = $($blockquotes[instance.phase]);
                
                $blockquotes.fadeOut();

                switch (instance.phase) {
                case 0:
                    Css.talk = false;
                    Div.setFace('talk');                   
                    break;
                case 1:
                    Css.talk = true;
                    Div.setFace('happy');                   
                    break;
                case 2:
                    break;
                case 3:
                    Css.talk = false;
                    Div.setFace('talk');                   
                    break;
                }

                _log('check', $currentQuote.data('audio'), VarsModel.SOUND);
                if ($currentQuote.data('audio') && VarsModel.SOUND !== false) {
                    Audio.playDialogue($currentQuote.data('audio'));
                } else {
                    $currentQuote.fadeIn();
                }

                instance.phase += 1;
            };

            instance.stop = function () {
                Css.stop();
                $(view).hide();
                instance.destroy();
            };

            instance.destroy = function () {
                StateEvent.SECTION_DESTROY.dispatch();
            };
		};

		return new Section2_CSS();
    });
