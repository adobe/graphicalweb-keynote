/*global define, TWEEN, _log, $ */

define(['graphicalweb/events/StateEvent',
        'graphicalweb/controllers/CameraController',
        'graphicalweb/views/components/Scenery',
        'graphicalweb/views/components/Div'],

	function (StateEvent, Camera, Scenery, Div) {
		
		var Section1_DIV = function () {
			var instance = this,
                stateId = 1,
                $blockquotes,
                $cover,
                view;

            instance.phaselength = 0;
            instance.phase = 0;

//private
            
            function handle_animIn_COMPLETE() {
                StateEvent.SECTION_ANIM_IN_COMPLETE.dispatch(stateId);
                $(view + ':not(blockquote)').show();
                Div.setFace('bored');
            }
            
//public
            instance.init = function () {
                                
                view = '.section1';
                $blockquotes = $('blockquote' + view);

                instance.phase = 0;
                instance.phaselength = $blockquotes.length;
                
                StateEvent.SECTION_READY.dispatch(stateId);
            };

            instance.animIn = function (direct) {
                var goalPosition = {x: -650, y: -768, z: 0},
                    divPosition = {x: 800, y: 0, z: 0};

                $blockquotes.hide();

                if (direct) {
                    Camera.setPosition(goalPosition);
                    Div.setPosition(divPosition);
                    handle_animIn_COMPLETE();
                } else {
                    Camera.reset(2000);
                    Camera.animatePosition(goalPosition, 2000, {callback: handle_animIn_COMPLETE});
                    Scenery.animateParallax(-200, 2000);
                    Div.animatePosition(divPosition, 2000);
                }
            };

            /**
             * next sequence
             */
            instance.next = function () {
                $blockquotes.fadeOut(function () {
                    $($blockquotes[instance.phase]).fadeIn();
                });

                if (instance.phase === 0) {
                    Div.setFace('talk');
                    Camera.animateZoom({value: 1.5}, 1000, {easing: TWEEN.Easing.Quadratic.EaseIn});
                } else if (instance.phase == 1) {
                    Div.setFace('talk');
                    Camera.animateZoom({value: 1}, 1000, {easing: TWEEN.Easing.Quadratic.EaseOut});
                }

                instance.phase += 1;
            };

            instance.stop = function () {
                Div.setFace('happy');
                $(view).hide();
                instance.destroy();
            };

            instance.destroy = function () {
                StateEvent.SECTION_DESTROY.dispatch();
            };
		};

		return new Section1_DIV();
    });
