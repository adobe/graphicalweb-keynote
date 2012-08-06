/*global $ define*/

define(['graphicalweb/utils/CSS3Helper'],

	function (CSS3Helper) {
		
		var CharBlend = function () {
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
            };

            instance.fadeIn = function () {
                container.fadeIn();
            };

            instance.fadeOut = function () {
                container.fadeOut();
            };


            instance.init();
		};

		return CharBlend;
    });
