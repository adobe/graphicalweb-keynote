/*global $ define */
define(['graphicalweb/views/components/BaseCharacter', 'text!graphicalweb/views/svg/charCSS.svg', 'text!graphicalweb/views/svg/IOS_charCSS.svg', 'graphicalweb/models/VarsModel'],

	function (BaseCharacter, svg, svg_noblink, VarsModel) {
		
        var CharCSS = function (id) {
            var instance = this,
                $container;

            function init() {
                $container = $(id);

                if (VarsModel.DETAILS === true) {
                    $container.html(svg);
                } else {
                    $container.html(svg_noblink);
                }
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
                //if (VarsModel.DETAILS === true) {
                $container.addClass('animating');
                //}
            };

            instance.stop = function () {
                //if (VarsModel.DETAILS === true) {
                $container.removeClass('animating');
                //}
            };
            
            instance.moveTo = function (position, speed) {
                $container.animate({'top': position.y, 'left': position.x}, speed);
            };

            init();
		};

        return CharCSS;
    });
