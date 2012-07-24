define(['graphicalweb/events/StateEvent',
        'graphicalweb/controllers/CameraController',
        'graphicalweb/views/components/Scenery',
        'graphicalweb/views/components/Div'],

	function (StateEvent, Camera, Scenery, Div) {
		
		var Section2_CSS = function () {
			var instance = this,
                stateId = 2,
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
                var goalPosition = {x: -1640, y: -768, z: 0},
                    divPosition = {x: 1700, y: 0, z: 0};
 
                $view = $('#section2');
                $blockquotes = $view.find('blockquote');

                Scenery.removeCurves();
                Scenery.addColor();
                Scenery.removeSpace();

                StateEvent.SECTION_READY.dispatch(stateId);

                instance.phase = 0;
                instance.phaselength = $blockquotes.length;

                if (direct) {
                    Camera.setPosition(goalPosition);
                    Div.setPosition(divPosition);
                } else {
                    Camera.reset(3000);
                    Camera.animatePosition(goalPosition, 3000);
                    Scenery.animateParallax(100, 3000);
                    Div.animatePosition(divPosition, 2000);
                }
            };

            //instance.start = function () {
            //    $cover = $('#cover');

            //    if ($cover.is(':visible')) {
            //        $cover.fadeOut();
            //    }
            //};

            instance.next = function () {
                $blockquotes.fadeOut(function () {
                    $($blockquotes[instance.phase]).fadeIn();
                });

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

		return new Section2_CSS();
    });
