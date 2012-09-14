/*global $ define TWEEN */
define(['graphicalweb/utils/CSS3Helper', 'text!graphicalweb/views/svg/charDIV.svg', 'text!graphicalweb/views/svg/IOS_charDIV.svg', 'graphicalweb/models/VarsModel'],

	function (CSS3Helper, svg, svg_ios, VarsModel) {
		
		var Div = function () {
			var instance = this,
                $container,
                interval,
                translateString,
                rotateString;

            instance.position = {x: 800, y: 0, z: 0};
            instance.rotation = {x: 0, y: 0, z: 0};

//private

            /*
             * update for tween
             */
            function update() {
                instance.position.x = Math.round(instance.position.x);
                instance.position.y = Math.round(instance.position.y);
                instance.position.z = Math.round(instance.position.z);
                translateString = 'translate3d(' + instance.position.x + 'px, ' + instance.position.y + 'px, ' + instance.position.z + 'px)';
                rotateString = 'rotateX(' + instance.rotation.x + 'deg) rotateY(' + instance.rotation.y + 'deg) rotateZ(' + instance.rotation.z + 'deg)';
                CSS3Helper.setTransform($container[0], translateString + rotateString);             //translation uses scene
            }

//public

			instance.init = function () {
                $container = $('#charDIV');

                if (detectOsName() == 'iPhone' || detectOsName() == 'iPad') {
                    $container.html(svg_ios);
                } else {
                    $container.html(svg);
                }

                if (VarsModel.DETAILS === true) {
                    $container.addClass('animating');
                }

                update();
            };

            /*
             * update based on requestanimframe
             */
            instance.update = function () {

            };

            //SETTERS

            //TODO:: remove
            instance.setFace = function (personality) {
                if (VarsModel.DETAILS === true) {
                    if (personality === 'talk') {
                        $container.addClass('talking');
                    } else {
                        $container.removeClass('talking');
                    }
                }
            }

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
                        update();
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
