/*global define $ Processing Modernizr*/
define(['graphicalweb/utils/CSS3Helper', 'graphicalweb/utils/ParticleSystem', 'graphicalweb/events/UserEvent'],

	function (CSS3Helper, ParticleSystem, UserEvent) {

		//THIS IS BASICALLY A PARTICLE MACHINE
		var TinyCanvas = function () {
			var instance = this,
                $canvas,
                canvas,
                ctx,
                p,
                system,
                _width = 200,
                _height = 200;

            instance.visible = false;

//private

            function handle_MOUSE_MOVE(e) {
                system.mx = e.pageX;
                system.my = e.pageY;
            }

            /**
             * processing
             * @param c processing context
             */
            function process(c) {
                var pixels,
                    i;
                
                c.setup = function () {
                    c.size(_width, _height);
                    c.noStroke();
                    c.frameRate(10);
                    c.fill(0, 0, 0);
                };

                c.draw = function () {
                    system.update();
                    pixels = system.pixels;

                    c.background(0, 0);

                    //TODO :: no particle system just random dots
					for (i = 0; i < pixels.length; i += 1) {
						c.fill(Math.floor(pixels[i].r), Math.floor(pixels[i].g), Math.floor(pixels[i].b), Math.floor(pixels[i].a));
						c.ellipse(pixels[i].x, pixels[i].y, pixels[i].size, pixels[i].size);
					}
				};
            }

//public
			instance.init = function () {
                if (Modernizr.canvas) {
                    if (typeof(p) === 'undefined') {
                        $canvas = $('#paradeCanvas');
                        canvas = $canvas[0];
                        ctx = $canvas[0].getContext('2d');
                        //TODO:: remove particle system
                        system = new ParticleSystem(_width, _height);
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
                    UserEvent.MOUSE_MOVE.add(handle_MOUSE_MOVE);
                }
            };

            instance.stop = function () {
                if (Modernizr.canvas) {
                    UserEvent.MOUSE_MOVE.remove(handle_MOUSE_MOVE);
                    p.exit();
                }
            };

            instance.moveTo = function (position, speed) {
                $canvas.animate({'top': position.y, 'left': position.x}, speed);
            };

            instance.circle = function () {
                if (Modernizr.canvas) {
                    instance.show();
                    system.setState('circle');
                }
            };

            instance.destroy = function () {

            };

            instance.init();
		};

		return TinyCanvas;
    });
