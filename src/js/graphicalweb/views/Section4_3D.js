define(['graphicalweb/events/StateEvent',
        'graphicalweb/controllers/CameraController',
        'graphicalweb/views/components/Svg',
        'graphicalweb/views/components/Div'],

	function (StateEvent, Camera, Character, Div) {
		
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
                var goalPosition = {x: 990, y: 282, z: -6290},
                    goalRotation = {x: 1, y: -55, z: 0},
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
                    
                    Div.animatePosition({x: 4800, y: -1150, z: 4300}, 2000);
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
