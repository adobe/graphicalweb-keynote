/*global $ define TWEEN d3*/
define(['text!graphicalweb/views/html/char3d.html', 
        'text!graphicalweb/views/svg/char3D.svg', 
        'graphicalweb/utils/CSS3Helper', 
        'graphicalweb/views/components/BaseCharacter', 
        'graphicalweb/models/VarsModel', 
        'graphicalweb/events/UserEvent'],

	function (html, svg, 
        CSS3Helper, 
        BaseCharacter, 
        VarsModel, 
        UserEvent) {
		
		var Char3D = function () {
            var instance = this,
                $container,
                $dots,
                $hoop,
                rotation = {x: 0, y: 0, z: 0},
                spinning = false,
                interval,
                offsetX,
                offsetY,
                delta = 0;

//private
            
            function handle_MOUSE_MOVE(e) {
                var mouseX = e.pageX,
                    mouseY = e.pageY,
                    charX = $container.offset().left,
                    charY = $container.offset().top,
                    angle,
                    ay, ax;

                //TODO:: get angle from guy
                ay = charY - mouseY;
                ax = charX - mouseX;
                angle = Math.atan(ay / ax) * 90 / Math.PI;

                if (ax < 0) {
                    rotation.z = angle;
                }
            }
            
//public
			instance.init = function () {
                $container = $('#charTransform');
                $container.html(html);
                $container.append(svg);
                $dots = d3.selectAll('.transform-dots path');
                $hoop = $('#hoop');

                //TODO:: animate, on mouse move stop animating and start following mouse, after delay of movement resume animation
            };

            instance.update = function () {
                delta += 1;

                if (delta % 20 === 0) {
                    $dots.each(function (d, i) {
                        offsetX = (Math.random() * 10) - 5;
                        offsetY = (Math.random() * 10) - 5;
                        d3.select(this).attr('transform', 'translate(' + offsetX + ',' + offsetY + ')');
                    });
                }

                if (spinning === true) {
                    rotation.y += 1;
                }
                
                CSS3Helper.setTransform($hoop[0], 'rotateY(' + rotation.y + 'deg) rotateZ(' + rotation.z + 'deg) rotateX(' + rotation.x + 'deg)'); //NOTE:: animating this in css causes problems (plane disappears) !
            };

            instance.start = function () {
                if (VarsModel.DETAILS === true) {
                    $container.addClass('animating');

                    if (VarsModel.PRESENTATION !== true) {
                        UserEvent.MOUSE_MOVE.add(handle_MOUSE_MOVE);
                    }
                }
            };

            instance.stop = function () {
                if (VarsModel.DETAILS === true) {
                    $container.removeClass('animating');

                    if (VarsModel.PRESENTATION !== true) {
                        UserEvent.MOUSE_MOVE.remove(handle_MOUSE_MOVE);
                    }
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

            instance.startRotation = function () {
                spinning = true;
            };

            instance.stopRotation = function () {
                spinning = false;
            };

            instance.init();
		};

		return new Char3D();
    });
