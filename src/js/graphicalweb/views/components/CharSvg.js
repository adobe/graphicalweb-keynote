/*global define $ TWEEN*/
define(['text!graphicalweb/views/svg/charSVG.svg', 'graphicalweb/utils/CSS3Helper', 'graphicalweb/views/components/BaseCharacter'],

	function (svg, CSS3Helper, BaseCharacter) {
		
		var CharSVG = function () {
			var instance = this,
                container,
                circle3,
                scaled = false,
                scale = {x: 0.5},
                delta = 0;

            instance.prototype = new BaseCharacter();

//private
            function update() {
                CSS3Helper.setTransform(container[0], 'scale(' + scale.x + ')');
            }
            
//public
			
            instance.prototype.WIDTH = 176;
            instance.prototype.HEIGHT = 94;
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

            instance.init = function () {
                container = $('#charSVG');
                container.prepend(svg);
                instance.prototype.element = container.find('.face');
            };

            instance.talk = function (value) {
                instance.prototype.talk = value;
            };

            instance.start = function () {
                instance.prototype.start();
            };

            instance.stop = function () {
                instance.prototype.stop();
            };

            instance.startSpin = function () {
                container.addClass('animating');
            };

            instance.stopSpin = function () {
                container.removeClass('animating');
            };

            instance.scale = function () {
                if (scaled !== true) {
                    new TWEEN.Tween(scale).to({x: 1.2}, 1000).easing(TWEEN.Easing.Sinusoidal.EaseInOut).onUpdate(update).start();
                    scaled = true;
                }
            };

            instance.unscale = function () {
                scale.x = 0.5;
                CSS3Helper.setTransform(container[0], 'scale(' + scale.x + ')');
                scaled = false;
            };


            instance.init();
		};

		return new CharSVG();
    });
