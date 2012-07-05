define(['graphicalweb/events/StateEvent',
        'graphicalweb/controllers/CameraController'],

	function (StateEvent, Camera) {
		
		var Section2_CSS = function () {
			var instance = this,
                stateId = 2,
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
            instance.init = function () {
                StateEvent.SECTION_READY.dispatch(stateId);

                instance.phase = 0;
                
                var goalPosition = {x: -1330, y: -768, z: 10};
                
                new TWEEN.Tween(Camera.position)
                    .to(goalPosition, 1000)
                    .onUpdate(function () {
                        Camera.update();
                    })
                    .start();
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

		return new Section2_CSS();
    });
