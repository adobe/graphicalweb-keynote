define(['graphicalweb/utils/CSS3Helper', 'graphicalweb/utils/ParticleSystem'],

	function (CSS3Helper, ParticleSystem) {

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

                c.mouseMoved = function () {
                    system.mx = c.mouseX;
                    system.my = c.mouseY;
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
                if (typeof(p) === 'undefined') {
                    $canvas = $('#charCanvas');
                    canvas = $canvas[0];
                    ctx = $canvas[0].getContext('2d');
                    system = new ParticleSystem();
                    p = new Processing(canvas, process);
                }
            };

            instance.show = function () {
                if (instance.visible === false) {
                    instance.start();
                    $canvas.fadeIn();
                    instance.visible = true;
                }
            };

            instance.hide = function () {
                if (instance.visible === true) {
                    instance.stop();
                    $canvas.fadeOut();
                    instance.visible = false;
                }
            };

            instance.start = function () {
                p.setup();
            };

            instance.stop = function () {
                p.exit();
            };

            instance.stars = function () {
                instance.show();
                system.setState('stars');
            };

            instance.face = function () {
                instance.show();
                system.setState('face');
            };

            instance.talk = function () {
                instance.show();
                system.setState('talking');
            };

            instance.disperse = function () {
                
            };

            instance.destroy = function () {
            
            };

            instance.init();
		};

		return new CharCanvas();
    });
