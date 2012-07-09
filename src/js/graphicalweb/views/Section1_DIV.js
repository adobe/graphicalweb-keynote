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
                var goalPosition = {x: 0, y: -768, z: 0};
                

                setTimeout(function () {

                    $('.animation').each(function () {
                        $(this)[0].beginElement();
                        $(this)[0].setAttribute('begin', '0.0s');
                    });

                }, 100);

                $view = $('#section1');
                $blockquotes = $view.find('blockquote');

                StateEvent.SECTION_READY.dispatch(stateId);

                instance.phase = 0;
                instance.phaselength = $blockquotes.length;

                if (direct) {
                    Camera.setPosition(goalPosition.x, goalPosition.y, goalPosition.z);            
                } else {
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

            /**
             * next sequence
             */
            instance.next = function () {
                $blockquotes.fadeOut(function () {
                    $($blockquotes[instance.phase]).fadeIn();
                });

                if (instance.phase === 0) {
                    new TWEEN.Tween(Camera.zoom)
                        .to({value: 1.5}, 1000)
                        .easing(TWEEN.Easing.Quadratic.EaseIn)
                        .onUpdate(function () {
                            Camera.update();
                        })
                        .start();

                    new TWEEN.Tween(Camera.rotation)
                        .to({x: 0, y: 0, z: 10}, 200)
                        .easing(TWEEN.Easing.Quadratic.EaseIn)
                        .delay(500)
                        .start();

                } else if (instance.phase == 1) {
                    new TWEEN.Tween(Camera.zoom)
                        .to({value: 1}, 1000)
                        .easing(TWEEN.Easing.Quadratic.EaseOut)
                        .onUpdate(function () {
                            Camera.update();
                        })
                        .start();

                    new TWEEN.Tween(Camera.rotation)
                        .to({x: 0, y: 0, z: 0}, 200)
                        .easing(TWEEN.Easing.Quadratic.EaseOut)
                        .start();
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
