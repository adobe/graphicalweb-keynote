define(['graphicalweb/events/StateEvent',
        'graphicalweb/controllers/CameraController',
        'graphicalweb/views/components/CharBlend',
        'graphicalweb/views/components/Div',
        'graphicalweb/views/components/Scenery'],

	function (StateEvent, Camera, Character, Div, Scenery) {
		
		var Section4_3D = function () {
			var instance = this,
                stateId = 7,
                character,
                $cover,
                $view;

            instance.phaselength = 0;
            instance.phase = 0;

//private
            function handle_animIn_COMPLETE() {
                StateEvent.SECTION_ANIM_IN_COMPLETE.dispatch(stateId);
                character.fadeIn();
            }

            
//public
            instance.init = function () {
                instance.phase = 0;
                
                character = new Character();

                StateEvent.SECTION_READY.dispatch(stateId);
            };

            instance.animIn = function (direct) {
                var goalPosition = {x: -650, y: -768, z: 0},
                    divPosition = {x: 800, y: 0, z: 0},
                    divRotation = {x: 0, y: 0, z: 0};

                if (direct) {
                    Camera.setPosition(goalPosition);
                    Div.setPosition(divPosition);
                    Div.setRotation(divRotation);
                    handle_animIn_COMPLETE();
                } else {
                    Camera.reset(2000);
                    Camera.animatePosition(goalPosition, 2000, {callback: handle_animIn_COMPLETE});
                    Scenery.animateParallax(-200, 2000);
                    Div.animatePosition(divPosition, 2000);
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

		return new Section4_3D();
    });
