define(['graphicalweb/events/StateEvent',
        'graphicalweb/controllers/CameraController',
        'graphicalweb/views/components/Svg'],

	function (StateEvent, Camera, Character) {
		
		var Section4_3D = function () {
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

            function update() {

            }
            
//public
            instance.init = function (direct) {
                var goalPosition = {x: 100, y: -768, z: -2000},
                    goalRotation = {x: 20, y: 10, z: 0},
                    goalPerspective = {value: 300};
                
                StateEvent.SECTION_READY.dispatch(stateId);

                instance.phase = 0;
                
                if (direct) {

                    Camera.setPosition(goalPosition);  
                    Camera.setRotation(goalRotation);
                    Camera.setPerspective(goalPerspective);

                } else {
                    
                    //$('.plane').css({webkitBackfaceVisibility: 'visible'});
                    
                    Camera.animatePerspective(goalPerspective, 200);
                    Camera.animateRotation(goalRotation, 2000);
                    Camera.animatePosition(goalPosition, 2000);

                }
            };

            instance.start = function () {
                $cover = $('#cover');

                if ($cover.is(':visible')) {
                    $cover.fadeOut();
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
