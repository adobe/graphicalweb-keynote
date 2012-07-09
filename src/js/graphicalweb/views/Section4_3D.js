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
                    goalPerspective = 300;
                
                StateEvent.SECTION_READY.dispatch(stateId);

                instance.phase = 0;
                
                if (direct) {

                    Camera.setPosition(goalPosition.x, goalPosition.y, goalPosition.z);  
                    Camera.setPerspective(goalPerspective);

                } else {
                    
                    $('.plane').css({webkitBackfaceVisibility: 'visible'});
                    
                    new TWEEN.Tween(Camera.perspective)
                        .to({value: goalPerspective}, 200)
                        .start();

                    new TWEEN.Tween(Camera.rotation)
                        .to(goalRotation, 2000)
                        .start();

                    new TWEEN.Tween(Camera.position)
                        .to(goalPosition, 2000)
                        .onUpdate(function () {
                            Camera.update();
                        })
                        .start();
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
