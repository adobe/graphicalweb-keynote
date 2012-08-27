/*global $ define */
define(['graphicalweb/views/components/BaseCharacter', 'text!graphicalweb/views/svg/charCSS.svg', 'graphicalweb/models/VarsModel'],

	function (BaseCharacter, svg, VarsModel) {
		
        var CharCSS = function (id) {
            var instance = this,
                $container;

            function init() {
                $container = $(id);
                $container.html(svg);
            }

            instance.talk = function (value) {
                if (VarsModel.DETAILS === true) {
                    if (value === true) {
                        $container.addClass('talking');
                        $container.addClass('auto');
                    } else {
                        $container.removeClass('talking');
                        $container.removeClass('auto');
                    }
                }
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
            
            instance.moveTo = function (position, speed) {
                $container.animate({'top': position.y, 'left': position.x}, speed);
            };

            init();
		};

        return CharCSS;
    });
