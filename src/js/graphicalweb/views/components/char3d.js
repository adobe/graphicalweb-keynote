define(['text!graphicalweb/views/html/char3d.html', 'graphicalweb/utils/CSS3Helper'],

	function (html, CSS3Helper) {
		
		var CharSVG = function () {
			var instance = this,
                container;

//private
            
            
//public
			instance.init = function () {
                container = $('#charTransform');
                container.html(html);

                //TODO:: animate, on mouse move stop animating and start following mouse, after delay of movement resume animation
            };

            instance.startSpin = function () {
            
            };

            instance.stopSpin = function () {
            
            };

            instance.init();
		};

		return CharSVG;
    });
