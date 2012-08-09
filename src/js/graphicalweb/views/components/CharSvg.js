/*global define $ TWEEN*/
define(['text!graphicalweb/views/svg/charSVG.svg', 'graphicalweb/utils/CSS3Helper'],

	function (svg, CSS3Helper) {
		
		var CharSVG = function () {
			var instance = this,
                container,
                circle3,
                scaled = false,
                scale = {x: 0.5},
                delta = 0;

//private
            function update() {
                CSS3Helper.setTransform(container[0], 'scale(' + scale.x + ')');
            }
            
//public
			instance.init = function () {
                container = $('#charSVG');
                container.html(svg);
            };

            instance.startSpin = function () {
                container.addClass('animating');
            };

            instance.stopSpin = function () {
                container.removeClass('animating');
            };

            instance.scale = function () {
                if (scaled !== true) {
                    new TWEEN.Tween(scale).to({x: 1.5}, 1000).onUpdate(update).start();
                    scaled = true;
                }
            };

            instance.unscale = function () {
                //new TWEEN.Tween(scale).to({x: 0.5}, 1000).onUpdate(update).start();
                scale.x = 0.5;
                CSS3Helper.setTransform(container[0], 'scale(' + scale.x + ')');
                scaled = false;
            };

            instance.init();
		};

		return new CharSVG();
    });
