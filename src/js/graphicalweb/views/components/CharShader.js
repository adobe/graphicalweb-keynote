/*global define $*/
define(['graphicalweb/utils/CSS3Helper', 'graphicalweb/models/VarsModel', 'text!graphicalweb/views/html/charShader.html', 'text!graphicalweb/views/svg/charSHADER.svg'],

	function (CSS3Helper, VarsModel, html, svg) {
		
		var CharShader = function () {
			var instance = this,
                $container;

//private

//public
			instance.init = function () {
                $container = $('#charShader');
                $container.html(html);
                $container.append(svg);
            };

            instance.update = function () {
                if (VarsModel.DETAILS === true) {
                
                }
            };

            instance.start = function () {
                $container.addClass('animating');
            };

            instance.stop = function () {
                $container.removeClass('animating');
            };

            instance.talk = function (value) {
                if (VarsModel.DETAILS === true) {
                    if (value === true) {
                        $container.addClass('talking');
                    } else {
                        $container.removeClass('talking');    
                    }
                }
            };

            instance.init();
		};

		return CharShader;
    });
