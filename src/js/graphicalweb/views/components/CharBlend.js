/*global $ */

define(['graphicalweb/utils/CSS3Helper'],

	function (svg, CSS3Helper) {
		
		var CharSVG = function () {
			var instance = this,
                container,
                circle3,
                delta = 0;

//private
            function update() {
                delta += 1;

            }
            
//public
			instance.init = function () {

                container = $('#charBlend');
                container.html(svg);

            };

            instance.startSpin = function () {
                container.addClass('animating');
            }

            instance.stopSpin = function () {
                container.removeClass('animating');
            }

            instance.init();
		};

		return CharSVG;
    });
