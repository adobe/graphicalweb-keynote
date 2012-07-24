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
            
            function handle_intro_CLICK(e) {
                instance.stop();
            }

            function handle_camera_FINISH() {
                //TODO:: not in ios
                character.startSpin();
            }

            function update() {

            }
            
//public
            instance.init = function (direct) {
                var goalPosition = {x: -2820, y: -768, z: 0},
                    
                    divPosition = {x: 2800, y: 0, z: 0};
                
                character = new Character();
                Scenery.addColor();
                Scenery.addCurves();
                Scenery.removeSpace();
                
                StateEvent.SECTION_READY.dispatch(stateId);

                instance.phase = 0;
                
                if (direct) {
                    Camera.setPosition(goalPosition);
                    handle_camera_FINISH();
                } else {
                    //Camera.animatePerspective({value: 1000000}, 200, {delay: 1850, easing: TWEEN.Easing.Quadratic.EaseIn});
                    Camera.animateRotation({x: 0, y: 0, z: 0}, 2000);
                    Camera.animatePosition(goalPosition, 2000, {callback: handle_camera_FINISH});
                    Scenery.animateParallax(200, 2000);
                    Div.animatePosition(divPosition, 2000);
                    Div.animateRotation({x: 0, y: 0, z: 0}, 200);
                }
            };

            //instance.start = function () {
            //    $cover = $('#cover');

            //    if ($cover.is(':visible')) {
            //        $cover.fadeOut();
            //    }
            //};

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
