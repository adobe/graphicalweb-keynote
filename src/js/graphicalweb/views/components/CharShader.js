/*global define $*/
define(['graphicalweb/utils/CSS3Helper'],

	function (CSS3Helper) {
		
		var CharShader = function () {
			var instance = this,
                container,
                circle3,
                delta = 0;

//private
            
//public
			instance.init = function () {
                container = $('#charShader');
            };

            instance.startAnim = function () {
                container.addClass('animating');
            }

            instance.stopAnim = function () {
                container.removeClass('animating');
            }

            instance.init();
		};

		return CharShader;
    });
