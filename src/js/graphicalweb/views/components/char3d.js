/*global $ define TWEEN d3*/
define(['text!graphicalweb/views/html/char3d.html', 'text!graphicalweb/views/svg/char3D.svg', 'graphicalweb/utils/CSS3Helper', 'graphicalweb/views/components/BaseCharacter', 'graphicalweb/models/VarsModel'],

	function (html, svg, CSS3Helper, BaseCharacter, VarsModel) {
		
		var Char3D = function () {
            var instance = this,
                $container,
                $dots,
                rotation = {x: 0, y: 0, z: 0},
                position = {x: 4800, y: -600, z: 4300},
                interval,
                offsetX,
                offsetY,
                delta = 0;

//private
            
            
//public
			instance.init = function () {
                $container = $('#charTransform');
                $container.html(html);
                $container.append(svg);
                $dots = d3.selectAll('.transform-dots path');
                
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

            instance.startRotation = function () {
                if (VarsModel.DETAILS === true) {
                    $container.addClass('spinning');    
                }
            };

            instance.stopRotation = function () {
                if (VarsModel.DETAILS === true) {
                    $container.removeClass('spinning');    
                }
            };

            instance.init();
		};

		return new Char3D();
    });
