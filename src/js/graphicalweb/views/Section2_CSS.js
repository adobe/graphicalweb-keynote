define(['graphicalweb/events/StateEvent',
        'graphicalweb/controllers/CameraController',
        'graphicalweb/views/components/Scenery'],

	function (StateEvent, Camera, Scenery) {
		
		var Section2_CSS = function () {
			var instance = this,
                stateId = 2,
                $blockquotes,
                $cover,
                $view,
                $body;
            
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
                var goalPosition = {x: -1330, y: -768, z: 10};
 
                $view = $('#section2');
                $body = $('body');
                $blockquotes = $view.find('blockquote');

                Scenery.addColor();

                StateEvent.SECTION_READY.dispatch(stateId);

                instance.phase = 0;
                instance.phaselength = $blockquotes.length;

                if (direct) {
                    Camera.setPosition(goalPosition);
                } else {
                    //Camera.reset(3000);
                    Camera.animatePosition(goalPosition, 3000);
                }
            };

            instance.start = function () {
                $cover = $('#cover');

                if ($cover.is(':visible')) {
                    $cover.fadeOut();
                }
            };

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
