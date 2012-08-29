/*global define $ Processing Modernizr*/
define(['graphicalweb/utils/CSS3Helper', 'graphicalweb/events/UserEvent'],

	function (CSS3Helper, UserEvent) {

		//THIS IS BASICALLY A PARTICLE MACHINE
		var TinyCanvas = function () {
			var instance = this,
                $canvas,
                canvas,
                ctx,
                pixels = [],
                p,
                delta = 0,
                _width = 200,
                _height = 200;

            instance.visible = false;

//private

            /**
             * processing
             * @param c processing context
             */
            function process(c) {
                var i,
                    newX,
                    newY,
                    size;
                
                c.setup = function () {
                    c.size(_width, _height);
                    c.noStroke();
                    c.frameRate(60);
                    c.fill(0, 0, 0);
                };

                c.draw = function () {
                    c.background(0, 0);

                    //TODO :: no particle system just random dots
					for (i = 0; i < pixels.length; i += 1) {
                        delta += 0.001 * pixels[i].alpha;
						c.fill(255, 255, 255, pixels[i].alpha);
                        newX = 100 + Math.sin(delta) * pixels[i].x;
                        newY = 100 + Math.cos(delta) * pixels[i].y;
						c.ellipse(newX, newY, pixels[i].size, pixels[i].size);
					}
				};
            }

//public

			instance.init = function () {
                if (Modernizr.canvas) {
                    if (typeof(p) === 'undefined') {
    
                        for (var i = 0; i < 50; i += 1) {
                            pixels.push({x: Math.random() * 50, y: Math.random() * 50, alpha: Math.random() * 255, size: Math.random() * 5});
                        }

                        $canvas = $('#paradeCanvas');
                        canvas = $canvas[0];
                        ctx = $canvas[0].getContext('2d');
                        p = new Processing(canvas, process);
                        instance.stop();
                    }
                }
            };

            instance.show = function () {
                if (Modernizr.canvas) {
                    if (instance.visible === false) {
                        instance.start();
                        $canvas.fadeIn();
                        instance.visible = true;
                    }
                }
            };

            instance.hide = function () {
                if (Modernizr.canvas) {
                    if (instance.visible === true) {
                        instance.stop();
                        $canvas.fadeOut();
                        instance.visible = false;
                    }
                }
            };

            instance.start = function () {
                if (Modernizr.canvas) {
                    p.setup();
                }
            };

            instance.stop = function () {
                if (Modernizr.canvas) {
                    p.exit();
                }
            };

            instance.moveTo = function (position, speed) {
                $canvas.animate({'top': position.y, 'left': position.x}, speed);
            };

            instance.destroy = function () {

            };

            instance.init();
		};

		return TinyCanvas;
    });
