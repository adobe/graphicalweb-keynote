/*global define, TWEEN, _log, $ */

define(['graphicalweb/events/StateEvent',
        'graphicalweb/controllers/CameraController',
        'graphicalweb/views/components/CharCanvas',
        'graphicalweb/views/components/Div'],

	function (StateEvent, Camera, Canvas, Div) {
		
		var Section5_CANVAS = function () {
			var instance = this,
                stateId = 5,
                character,
                $cover,
                $view;

            instance.phaselength = 0;
            instance.phase = 0;

//private
            
            function handle_animIn_COMPLETE() {
                StateEvent.SECTION_ANIM_IN_COMPLETE.dispatch(stateId);
            }

//public
            instance.init = function () {
                instance.phase = 0;
                
                StateEvent.SECTION_READY.dispatch(stateId);
            };

            instance.animIn = function (direct) {
                var goalPosition = {x: 790, y: 792, z: -7050},
                    goalRotation = {x: 1, y: -55, z: 0},
                    divPosition = {x: 4800, y: -1250, z: 4300},
                    divRotation = {x: 0, y: 50, z: 0};

                if (direct) {
                    Camera.setPosition(goalPosition);  
                    Camera.setRotation(goalRotation);
                } else {
                    Camera.animateRotation(goalRotation, 1000);
                    Camera.animatePosition(goalPosition, 1000, {easing: TWEEN.Easing.Quadratic.EaseInOut});
                    
                    Div.animatePosition(divPosition, 2000, {easing: TWEEN.Easing.Sinusoidal.EaseIn});
                    Div.animateRotation(divRotation, 2000, {callback: handle_animIn_COMPLETE});
                }
            };

            instance.next = function () {

                instance.phase += 1;

                //TODO:: sequence through
            };

            instance.stop = function () {
                instance.destroy();
            };

            instance.destroy = function () {
                StateEvent.SECTION_DESTROY.dispatch();
            };
		};

		return new Section5_CANVAS();
    });
