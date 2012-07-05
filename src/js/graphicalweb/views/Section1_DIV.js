define(['graphicalweb/events/StateEvent',
        'graphicalweb/controllers/CameraController'],

	function (StateEvent, Camera) {
		
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
                $view = $('#section2');
                $blockquotes = $view.find('blockquote');

                StateEvent.SECTION_READY.dispatch(stateId);

                instance.phase = 0;
                instance.phaselength = $blockquotes.length;

                var goalPosition = {x: 0, y: -768, z: 0};
             
                if (direct) {
                    Camera.setPosition(goalPosition.x, goalPosition.y, goalPosition.z);            
                } else {
                    new TWEEN.Tween(Camera.position)
                        .to(goalPosition, 1000)
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

		return new Section1_DIV();
    });
