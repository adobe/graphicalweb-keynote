define(['graphicalweb/events/StateEvent',
        'graphicalweb/controllers/CameraController',
        'graphicalweb/views/components/Scenery',
        'graphicalweb/views/components/Div'],

	function (StateEvent, Camera, Scenery, Div) {
		
		var Section1_DIV = function () {
			var instance = this,
                stateId = 1,
                $blockquotes,
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
                var goalPosition = {x: -650, y: -768, z: 0},
                    divPosition = {x: 800, y: 0, z: 0};
                
                $view = $('#section1');
                $blockquotes = $view.find('blockquote');

                Scenery.removeColor();
                Scenery.removeCurves();
                
                StateEvent.SECTION_READY.dispatch(stateId);

                instance.phase = 0;
                instance.phaselength = $blockquotes.length;

                if (direct) {
                    Camera.setPosition(goalPosition);
                    Div.setPosition(divPosition);
                } else {
                    Camera.reset(2000);
                    Camera.animatePosition(goalPosition, 2000);
                    Div.animatePosition(divPosition, 2000);
                }
            };

            instance.start = function () {
                $cover = $('#cover');

                if ($cover.is(':visible')) {
                    $cover.fadeOut();
                }
            };

            /**
             * next sequence
             */
            instance.next = function () {
                $blockquotes.fadeOut(function () {
                    $($blockquotes[instance.phase]).fadeIn();
                });

                if (instance.phase === 0) {
                    Camera.animateZoom({value: 1.5}, 1000, {easing: TWEEN.Easing.Quadratic.EaseIn});
                    //Camera.animateRotation({x: 0, y: 0, z: 10}, 200, {delay: 500, easing: TWEEN.Easing.Quadratic.EaseIn});
                } else if (instance.phase == 1) {
                    Camera.animateZoom({value: 1}, 1000, {easing: TWEEN.Easing.Quadratic.EaseOut});
                    //Camera.animateRotation({x: 0, y: 0, z: 0}, 200, {easing: TWEEN.Easing.Quadratic.EaseOut});
                }

                instance.phase += 1;
            };

            instance.stop = function () {
                $blockquotes.fadeOut();
                instance.destroy();
            };

            instance.destroy = function () {
                StateEvent.SECTION_DESTROY.dispatch();
            };
		};

		return new Section1_DIV();
    });
