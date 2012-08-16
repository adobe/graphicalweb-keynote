/*global $ define TWEEN*/
define(['text!graphicalweb/views/html/char3d.html', 'graphicalweb/utils/CSS3Helper', 'graphicalweb/views/components/BaseCharacter'],

	function (html, CSS3Helper, BaseCharacter) {
		
		var Char3D = function () {
            var instance = this,
                container,
                rotation = {x: 0, y: 0, z: 0},
                position = {x: 4800, y: -600, z: 4300},
                interval;

            instance.prototype = new BaseCharacter();
            
            instance.prototype.WIDTH = 200;
            instance.prototype.HEIGHT = 200;
            instance.prototype.NUM_COLUMNS = 10;
            instance.prototype.anim_map = [
                {name: 'idle1', min: 0, max: 20},
                {name: 'idle2', min: 21, max: 41},
                {name: 'talk1', min: 42, max: 62},
                {name: 'talk2', min: 63, max: 83}
            ];
            instance.prototype.idle_maps = [0, 1];
            instance.prototype.talk_maps = [2, 3];
            instance.prototype.talk = false;

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
                
                instance.prototype.element = container.find('.face');

                //TODO:: animate, on mouse move stop animating and start following mouse, after delay of movement resume animation
            };

            instance.start = instance.prototype.start;
            instance.stop = instance.prototype.stop;

            instance.talk = function (value) {
                instance.prototype.talk = value;
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
