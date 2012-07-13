define(['graphicalweb/events/StateEvent',
        'graphicalweb/controllers/CameraController',
        'graphicalweb/views/components/CharSvg',
        'graphicalweb/views/components/Div',
        'graphicalweb/views/components/Scenery'],

	function (StateEvent, Camera, Character, Div, Scenery) {
		
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
                var goalPosition = {x: 790, y: 292, z: -6550},
                    goalRotation = {x: 1, y: -55, z: 0},
                    //goalPerspective = {value: 300},
                    divPosition = {x: 4800, y: -1150, z: 4300},
                    divRotation = {x: 0, y: 50, z: 0};
                
                Scenery.addSpace();

                StateEvent.SECTION_READY.dispatch(stateId);

                instance.phase = 0;
                
                if (direct) {

                    Camera.setPosition(goalPosition);  
                    Camera.setRotation(goalRotation);
                    //Camera.setPerspective(goalPerspective);

                } else {
                    
                    //$('.plane').css({webkitBackfaceVisibility: 'visible'});
                    //Camera.animatePerspective(goalPerspective, 200);
                    Camera.animateRotation(goalRotation, 1000);
                    Camera.animatePosition(goalPosition, 1000, {easing: TWEEN.Easing.Quadratic.EaseInOut});
                    
                    Div.animatePosition(divPosition, 2000, {easing: TWEEN.Easing.Sinusoidal.EaseIn});
                    Div.animateRotation(divRotation, 2000);
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
