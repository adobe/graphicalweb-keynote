/*global define $ TWEEN*/

define(['graphicalweb/events/StateEvent',
        'graphicalweb/controllers/CameraController',
        'graphicalweb/views/components/CharSvg',
        'graphicalweb/views/components/Div',
        'graphicalweb/views/components/Scenery'],

	function (StateEvent, Camera, Character, Div, Scenery) {
		
		var Section4_3D = function () {
			var instance = this,
                stateId = 8,
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
            instance.init = function (direct) {
                instance.phase = 0;
                StateEvent.SECTION_READY.dispatch(stateId);
            };

            instance.animIn = function (direct) {
                var goalPosition = {x: -1850, y: -768, z: 0},
                    divPosition = {x: 2000, y: 0, z: 0},
                    divRotation = {x: 0, y: 0, z: 0};

                if (direct) {
                    Camera.setPosition(goalPosition);
                    Div.setPosition(divPosition);
                    Div.setRotation(divRotation);
                    handle_animIn_COMPLETE();
                } else {
                    Camera.animatePosition(goalPosition, 1000, {easing: TWEEN.Easing.Quadratic.EaseInOut});
                    Div.animateRotation(divRotation, 2000);                    
                    Div.animatePosition(divPosition, 2000, {easing: TWEEN.Easing.Sinusoidal.EaseIn, callback: handle_animIn_COMPLETE});
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

		return new Section4_3D();
    });
