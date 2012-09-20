/*global define $*/
define(['graphicalweb/utils/CSS3Helper', 
        'graphicalweb/models/VarsModel', 
        'text!graphicalweb/views/html/charShader.html', 
        'text!graphicalweb/views/svg/charSHADER.svg', 
        'graphicalweb/events/UserEvent'],

	function (CSS3Helper, VarsModel, html, svg, UserEvent) {
		
		var CharShader = function () {
			var instance = this,
                $container,
                $disc,
                rotation = {x: 60, y: 0, z: 60},
                delta = 0;

//private

            function handle_MOUSE_MOVE(e) {
                var mouseX = e.pageX,
                    charX = 0,
                    dx;
                
                dx = mouseX - charX;
                rotation.z = Math.abs(dx) * 0.1;
            }

//public
			instance.init = function () {
                $container = $('#charShader');

                if (VarsModel.ADOBE_BUILD !== false) {
                    $container.html(html);
                    $container.append(svg);
                } else {
                    $container.html('<img src="./assets/img/characters/shader.png">');
                    //$container.append(svg);
                }

                $disc = $container.find('.shader-side');
            };

            instance.update = function () {
                if (VarsModel.DETAILS === true) {
                    delta += 0.1;
                    $disc[0].style.webkitAnimation = 'none';
                    if (VarsModel.CANARY !== true) {
                        $disc[0].style.webkitFilter = 'custom(url(../assets/shaders/jelly.vs) url(../assets/shaders/jelly.fs), 50 50 filter-box, transform rotateY(' + rotation.y + 'deg) rotateX(' + rotation.x + 'deg) rotateZ(' + rotation.z + 'deg) scale(0.6), delta ' + delta + ', backface 0.0)';
                    } else {
                        $disc[0].style.webkitFilter = 'custom(url(../assets/shaders/jelly_new.vs) mix(url(../assets/shaders/jelly_new.fs) multiply source-atop), 50 50 filter-box, transform translateY(-10px) rotateY(0deg) rotateX(60deg) rotateZ(170deg) scale(0.55), delta 1.0, backface 0.0);
';
                    }
                }
            };

            instance.start = function () {
                $container.addClass('animating');
                UserEvent.MOUSE_MOVE.add(handle_MOUSE_MOVE);
            };

            instance.stop = function () {
                $container.removeClass('animating');
                UserEvent.MOUSE_MOVE.remove(handle_MOUSE_MOVE);
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
