define([],

	function () {

        var Particle,
            ParticleSystem,
            _width = window.innerWidth,
            _height = window.innerHeight;


        Particle = function () {
                this.x = Math.random() * _width;
                this.y = _height / 2;
                this.toX = 0;
                this.toY = _height / 2;
                //this.color = 0; //Math.random() * 200 + 55;
                this.r = 255;
                this.g = 255;
                this.b = 255;
                this.angle = Math.random() * Math.PI * 2;
                this.size = Math.random() * 4 + 1;
                //this.toSize = Math.random() * 4 + 1;
            };

		
		ParticleSystem = function () {
                var system = this,
                i,
                mx = 0,
                my = 0,
                impulsX = 0,
                impulsY = 0,
                impulsToX = 0,
                impulsToY = 0,
                machineIndex = 0,
                now,
                startedAt,
                pixels = [];

                system.pixels = pixels;
                system.numParticles = 100;
                
                for (i = 0; i < system.numParticles; i += 1) {
                    pixels[i] = new Particle();
                    pixels[i].toX = pixels[i].x;
                    pixels[i].speedX = 0;
                    pixels[i].speedY = 0;
                }

                system.update = function () {
                    var a,  b,  c, 
                        alpha, 
                        transIndex, 
                        r1,  r2;

                    impulsX = impulsX + (impulsToX - impulsX) / 30;
					impulsY = impulsY + (impulsToY - impulsY) / 30;

					// move to to x
					for (i = 0; i < pixels.length; i += 1) {
						pixels[i].x = pixels[i].x + (pixels[i].toX - pixels[i].x) / 10;
						pixels[i].y = pixels[i].y + (pixels[i].toY - pixels[i].y) / 10;
						pixels[i].size = pixels[i].size + (pixels[i].toSize - pixels[i].size) / 10;

                        /*
                        //animate color
						pixels[i].r = pixels[i].r + (pixels[i].toR - pixels[i].r) / 10;
						pixels[i].g = pixels[i].g + (pixels[i].toG - pixels[i].g) / 10;
						pixels[i].b = pixels[i].b + (pixels[i].toB - pixels[i].b) / 10;
                        */
					}
                    
                    // update speed
					for (i = 0; i < pixels.length; i += 1) {
						// check for flightmode
						a = Math.abs(pixels[i].toX - mx) *  Math.abs(pixels[i].toX - mx);
	                    b = Math.abs(pixels[i].toY - my) *  Math.abs(pixels[i].toY - my);
	                    c = Math.sqrt(a + b);

						if (pixels[i].flightMode != 2) {
							if (c < 120) {
								if (pixels[i].flightMode === 0) {
				                    alpha = Math.atan2(pixels[i].y - my,  pixels[i].x - mx) * 180 / Math.PI + Math.random() * 180 - 90;
				                    pixels[i].degree = alpha;
									pixels[i].degreeSpeed = Math.random() * 1 + 0.5;
									pixels[i].frame = 0;
								}
								pixels[i].flightMode = 1;
							} else {
								pixels[i].flightMode = 0;
							}
						}

						// random movement
						if (pixels[i].flightMode === 0) {
							// change position
							pixels[i].toX += pixels[i].speedX;
							pixels[i].toY += pixels[i].speedY;

							// check for bounds
							if (pixels[i].x < 0) {
								pixels[i].x = _width;
								pixels[i].toX = _width;
							}
							if (pixels[i].x > _width) {
								pixels[i].x = 0;
								pixels[i].toX = 0;
							}

							if (pixels[i].y < 0) {
								pixels[i].y = _height;
								pixels[i].toY = _height;
							}
							if (pixels[i].y > _height) {
								pixels[i].y = 0;
								pixels[i].toY = 0;
							}
						}

						// seek mouse
						if (pixels[i].flightMode == 1) {
							pixels[i].toX = mx + Math.cos((pixels[i].degree + pixels[i].frame) % 360 * Math.PI / 180) * c;
							pixels[i].toY = my + Math.sin((pixels[i].degree + pixels[i].frame) % 360 * Math.PI / 180) * c;
							pixels[i].frame += pixels[i].degreeSpeed;
							pixels[i].degreeSpeed += 0.01;
						}

						if (pixels[i].flightMode != 2) {
							// add impuls
							pixels[i].toX += Math.floor(impulsX * pixels[i].size / 30);
							pixels[i].toY += Math.floor(impulsY * pixels[i].size / 30);
						}
					}

                    // set an choord
					r1 = Math.floor(Math.random() * pixels.length);
					r2 = Math.floor(Math.random() * pixels.length);

					if (pixels[r1].flightMode != 2) {
                        //pixels[r1].size = Math.random() * 30;
                    }
					
                    if (pixels[r2].flightMode != 2) 
                    {
                        //pixels[r2].size = Math.random() * 30;
                    }

					c.framecount += 1;

                    //iterate through machine to know when to transition to next point
					now = new Date();
					if (now.getTime() - startedAt.getTime() >= machine[machineIndex]) {
						machineIndex += 1;
						impulsX = Math.random() * 800 - 400;
						impulsY = -Math.random() * 400;

						transIndex = Math.floor(Math.random() * transitions.length);
						transitions[transIndex]();
					}				

                };


            };

        }

		return new CSS3Helper();
    });
