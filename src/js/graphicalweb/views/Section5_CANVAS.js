define(['graphicalweb/events/StateEvent',
        'graphicalweb/controllers/CameraController',
        'graphicalweb/views/components/CharCanvas',
        'graphicalweb/views/components/Div',
        'graphicalweb/views/components/Scenery'],

	function (StateEvent, Camera, Canvas, Div, Scenery) {
		
		var Section5_CANVAS = function () {
			var instance = this,
                stateId = 4,
                character,
                $cover,
                $view;

            instance.phaselength = 0;
            instance.phase = 0;

//private
            
            function handle_intro_CLICK(e) {
                instance.stop();
            }

//public
            instance.init = function (direct) {
                var goalPosition = {x: 790, y: 792, z: -7050},
                    goalRotation = {x: 1, y: -55, z: 0},
                    divPosition = {x: 4800, y: -1250, z: 4300},
                    divRotation = {x: 0, y: 50, z: 0};
                
                _log('canvas!!');
                Scenery.addSpace();

                StateEvent.SECTION_READY.dispatch(stateId);
http://keynote.site/
                instance.phase = 0;
                
                if (direct) {

                    Camera.setPosition(goalPosition);  
                    Camera.setRotation(goalRotation);

                } else {
                    
                    Camera.animateRotation(goalRotation, 1000);
                    Camera.animatePosition(goalPosition, 1000, {easing: TWEEN.Easing.Quadratic.EaseInOut});
                    
                    Div.animatePosition(divPosition, 2000, {easing: TWEEN.Easing.Sinusoidal.EaseIn});
                    Div.animateRotation(divRotation, 2000);
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
