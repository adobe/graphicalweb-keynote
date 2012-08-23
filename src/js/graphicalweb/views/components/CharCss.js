/*global $ define */
define(['graphicalweb/views/components/BaseCharacter', 'text!graphicalweb/views/svg/charCSS.svg', 'graphicalweb/models/VarsModel'],

	function (BaseCharacter, svg, VarsModel) {
		
        var CharCSS = function () {
            var instance = this,
                $container;

            function init() {
                $container = $('#charCSS');
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

            //instance.start = instance.prototype.start;
            //instance.stop = instance.prototype.stop;

            init();
		};

        return new CharCSS();
    });
