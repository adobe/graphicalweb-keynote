/*global define, TWEEN, _log, $ */

define(['graphicalweb/events/StateEvent',
        'graphicalweb/controllers/CameraController',
        'graphicalweb/views/components/Scenery',
        'graphicalweb/views/components/CharSvg',
        'graphicalweb/views/components/Div'],

	function (StateEvent, Camera, Scenery, Character, Div) {
		
		var Section3_SVG = function () {
			var instance = this,
                stateId = 3,
                character,
                $cover,
                $view;

            instance.phaselength = 0;
            instance.phase = 0;

//private
            
            function handle_animIn_COMPLETE() {
                StateEvent.SECTION_ANIM_IN_COMPLETE.dispatch(stateId);
                
                setTimeout(function () {
                    character.startSpin();
                }, 1000);
            }

//public
            instance.init = function () {
                               
                instance.phase = 0;
                character = new Character();
                
                StateEvent.SECTION_READY.dispatch(stateId);
            };

            instance.animIn = function (direct) {
                var goalPosition = {x: -2820, y: -768, z: 0},
                    divPosition = {x: 2800, y: 0, z: 0};

                if (direct) {
                    Camera.setPosition(goalPosition);
                    handle_animIn_COMPLETE();
                } else {
                    //Camera.animatePerspective({value: 1000000}, 200, {delay: 1850, easing: TWEEN.Easing.Quadratic.EaseIn});
                    Camera.animateRotation({x: 0, y: 0, z: 0}, 2000);
                    Camera.animatePosition(goalPosition, 2000, {callback: handle_animIn_COMPLETE});
                    Scenery.animateParallax(0, 2000);
                    Div.animatePosition(divPosition, 2000);
                    Div.animateRotation({x: 0, y: 0, z: 0}, 200);
                }
            };

            instance.next = function () {

                instance.phase += 1;

                //TODO:: sequence through
            };

            instance.stop = function () {
                character.stopSpin();
                instance.destroy();
            };

            instance.destroy = function () {
                StateEvent.SECTION_DESTROY.dispatch();
            };
		};

		return new Section3_SVG();
    });
