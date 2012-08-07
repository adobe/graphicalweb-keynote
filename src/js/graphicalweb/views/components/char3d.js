/*global $ define TWEEN*/
define(['text!graphicalweb/views/html/char3d.html', 'graphicalweb/utils/CSS3Helper'],

	function (html, CSS3Helper) {
		
		var Char3D = function () {
			var instance = this,
                container,
                rotation = {x: 0, y: 0, z: 0},
                position = {x: 4800, y: -600, z: 4300},
                interval;

//private
            function update() {
                rotation.y += 1;

                CSS3Helper.setTransform(container[0], 
                    'translate3d(' + position.x + 'px, ' + position.y + 'px, ' + position.z + 'px)' +
                    'rotateX(' + rotation.x + 'deg) rotateY(' + rotation.y + 'deg) rotateZ(' + rotation.z + 'deg)');
            }
            
//public
			instance.init = function () {
                container = $('#charTransform');
                container.html(html);

                //TODO:: animate, on mouse move stop animating and start following mouse, after delay of movement resume animation
            };

            instance.startRotation = function () {
                interval = setInterval(update, 10);   
            };

            instance.stopRotation = function () {

                var goalRotation = {x: 0, y: 0, z: 0};

                clearInterval(interval);
                
                new TWEEN.Tween(rotation)
                    .to(goalRotation, 1000)
                    .onUpdate(function () {
                        update();
                    })
                    .start();
            };

            instance.init();
		};

		return new Char3D();
    });
