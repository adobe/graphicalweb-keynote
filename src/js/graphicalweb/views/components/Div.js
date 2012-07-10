define(['graphicalweb/utils/CSS3Helper'],

	function (CSS3Helper) {
		
		var Div = function () {
			var instance = this,
                element,
                translateString,
                rotateString;

            instance.position = {x: 0, y: 0, z: 0};
            instance.rotation = {x: 0, y: 0, z: 0};

//private
            function update() {
                translateString = 'translate3d(' + instance.position.x + 'px, ' + instance.position.y + 'px, ' + instance.position.z + 'px)';
                rotateString = 'rotateX(' + instance.rotation.x + 'deg) rotateY(' + instance.rotation.y + 'deg) rotateZ(' + instance.rotation.z + 'deg)';
                CSS3Helper.setTransform(element[0], translateString);             //translation uses scene
            }
            
//public

			instance.init = function () {
                element = $('#charDIV');
            };

            //SETTERS
            instance.setPosition = function (newPosition) {
                instance.position = newPosition;
                update();
            };

            instance.setRotation = function (newRotation) {
                instance.rotation = newRotation;
                update();
            };

            //ANIMATION
            instance.animate = function (start, end, duration, params) {

                if (typeof(params) !== 'undefined') {
                    params.delay = typeof(params.delay) == 'undefined' ? 0 : params.delay;
                    params.easing = typeof(params.easing) == 'undefined' ? TWEEN.Easing.Linear.EaseNone : params.easing;
                } else {
                    params = {};
                    params.delay = 0;
                    params.easing = TWEEN.Easing.Linear.EaseNone;
                }

                new TWEEN.Tween(start)
                    .to(end, duration)
                    .delay(params.delay)
                    .easing(params.easing)
                    .onUpdate(function () {
                        update();
                    })
                    .onComplete(function () {
                        if (typeof(params.callback) == 'function') {
                            params.callback();
                        }
                    })
                    .start();
            };

            instance.animatePosition = function (goalPosition, duration, params) {
                instance.animate(instance.position, goalPosition, duration, params);
            };

            instance.animateRotation = function (goalRotation, duration, params) {
                instance.animate(instance.rotation, goalRotation, duration, params);
            };

            instance.init();
		};

		return new Div();
    });
