/*global define $ Processing Modernizr*/
define(['graphicalweb/utils/CSS3Helper', 'graphicalweb/utils/ParticleSystem', 'graphicalweb/events/UserEvent'],

	function (CSS3Helper, ParticleSystem, UserEvent) {

		//THIS IS BASICALLY A PARTICLE MACHINE
		var CharCanvas = function () {
			var instance = this,
                $canvas,
                canvas,
                ctx,
                p,
                system,
                _width = window.innerWidth,
                _height = window.innerHeight;

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
                    c.frameRate(60);
                    c.fill(0, 0, 0);
                };

                c.draw = function () {
                    system.update();
                    pixels = system.pixels;

                    c.background(0, 0);

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
                        $canvas = $('#charCanvas');
                        canvas = $canvas[0];
                        ctx = $canvas[0].getContext('2d');
                        system = new ParticleSystem(_width, _height);
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
                    system = new ParticleSystem(_width, _height);
                    p = new Processing(canvas, process); //need to setup again otherwise causes problems
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

            instance.stars = function () {
                if (Modernizr.canvas) {
                    instance.show();
                    system.setState('stars');
                }
            };

            instance.face = function () {
                if (Modernizr.canvas) {
                    instance.show();
                    system.setState('face');
                }
            };

            instance.talk = function () {
                if (Modernizr.canvas) {
                    instance.show();
                    system.setState('talking');
                }
            };

            instance.disperse = function () {
                
            };

            instance.resize = function () {
                _width = window.innerWidth;
                _height = window.innerHeight;
                if (Modernizr.canvas && typeof(p) !== 'undefined') {
                    p.setup();
                }
            };

            instance.destroy = function () {

            };

            instance.init();
		};

		return new CharCanvas();
    });
