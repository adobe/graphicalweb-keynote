/*global $ define*/

define(['graphicalweb/utils/CSS3Helper', 'graphicalweb/views/components/BaseCharacter', 'text!graphicalweb/views/svg/CharBLEND.svg', 'graphicalweb/models/VarsModel'],

	function (CSS3Helper, BaseCharacter, svg, VarsModel) {
		
		var CharBlend = function () {
			var instance = this,
                $container,
                delta = 0;

//private


//public
            
            instance.init = function () {
                $container = $('#charBlend');
                $container.html(svg);
            };

            instance.start = function () {
                if (VarsModel.DETAILS === true) {
                    $container.addClass('animating');    
                }
            };

            instance.stop = function () {
                if (VarsModel.DETAILS === true) {
                    $container.removeClass('animating');    
                }
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
			
            instance.fadeIn = function () {
                $container.fadeIn(200, function () {
                    $container.css({'left': '1000px'});
                });
            };

            instance.fadeOut = function () {
                $container.fadeOut();
            };


            instance.init();
		};

		return CharBlend;
    });
