define([],

	function () {

        var Particle,
            ParticleSystem,
            _width = window.innerWidth,
            _height = window.innerHeight;


        Particle = function () {
                this.x = Math.random() * _width;
                this.y = Math.random() * _height;
                this.toX = this.x;
                this.toY = this.y;
                //this.color = 0; //Math.random() * 200 + 55;
                this.r = 255;
                this.toR = 255;
                this.g = 255;
                this.toG = 255;
                this.b = 255;
                this.toB = 255;
                this.a = Math.random() * 255;
                this.toA = this.a;
                this.angle = Math.random() * Math.PI * 2;
                this.size = Math.random() * 4 + 1;
                this.toSize = this.size;
                this.speedX = 0;
                this.speedY = 0;
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
                transitions,
                now,
                startedAt = new Date(),
                pixels = [];

                system.pixels = pixels;
                system.numParticles = 100;
                system.mx = mx;
                system.my = my;
                system.framecount = 0;
                system.state = "stars";
                
                for (i = 0; i < system.numParticles; i += 1) {
                    pixels[i] = new Particle();
                    pixels[i].toX = pixels[i].x;
                }

                // random position
                function transition_random() {
                    for (i = 0; i < pixels.length; i += 1) {
                        var p = pixels[i];
                        if (p.flightMode != 2) {
                            p.toX = Math.random() * _width;
                            p.toY = Math.random() * _height;
                            p.speedX = 0;
                            p.speedY = 0; 
                        }
                    }
                }

                function transition_face() {
                    var pointList = [[981, 360], [982, 368], [969, 361], [990, 359], [979, 345], [754, 316], [744, 322], [750, 330], [761, 325], [715, 437], [726, 441], [740, 443], [755, 451], [779, 455], [804, 464], [828, 468], [847, 472], [878, 475], [909, 482], [942, 483], [967, 487], [969, 506], [949, 539], [927, 560], [901, 577], [841, 583], [796, 582], [756, 566], [725, 541], [715, 519], [707, 483], [702, 467], [704, 447], [707, 434], [708, 500], [719, 528], [734, 558], [743, 566], [768, 573], [779, 579], [809, 585], [828, 586], [854, 588], [865, 587], [889, 585], [912, 569], [940, 554], [875, 586], [956, 532], [964, 518], [953, 484], [925, 482], [892, 479], [861, 474], [815, 467], [792, 459], [767, 453], [837, 468], [973, 490]],
                        p;
                    impulsX = 0;
                    impulsY = 0;
                    for (i = 0; i < pixels.length; i += 1) {
                        p = pixels[i];
                        if (p.flightMode != 2) {
                            p.toX = pointList[Math.floor(i * 3.6) % pointList.length][0] - 200;
                            p.toY = pointList[Math.floor(i * 3.6) % pointList.length][1] - 150;
                            p.speedX = (Math.random() - 0.5) / 2;
                            p.speedY = (Math.random() - 0.5) / 2; 
                        }
                    }
                }

                function transition_disperse() {
                    for (i = 0; i < pixels.length; i += 1) {
                        var p = pixels[i];
                        if (p.flightMode != 2) {
                            p.toX = _height;
                            p.toY = _width;
                            p.speedX = 0;
                            p.speedY = 0; 
                            p.speedX = (Math.random() - 0.5) / 2;
                            p.speedY = (Math.random() - 0.5) / 2; 
                        }
                    }
                }

                transitions = [
                    transition_random,
                    transition_face,
                    transition_disperse
                ];

                //UPDATE METHOD
                system.update = function () {
                    var a,  b,  c, 
                        alpha, 
                        transIndex;

                    _log('update');
                    mx = system.mx;
                    my = system.my;

                    impulsX = impulsX + (impulsToX - impulsX) / 30;
					impulsY = impulsY + (impulsToY - impulsY) / 30;

					// move to to x
					for (i = 0; i < pixels.length; i += 1) {
						pixels[i].x = pixels[i].x + (pixels[i].toX - pixels[i].x) / 10;
						pixels[i].y = pixels[i].y + (pixels[i].toY - pixels[i].y) / 10;
						pixels[i].size = pixels[i].size + (pixels[i].toSize - pixels[i].size) / 10;
						pixels[i].a = pixels[i].a + (pixels[i].toA - pixels[i].a) / 10;
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

                        if (system.state !== "stars") {
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
					}

                    system.framecount += 1;

                    if (system.state == "stars") {

                        if (system.random === false) {
                            impulsX = 0;
                            impulsY = 0;
                            transitions[0]();
                            system.random = true; 
                        }

                    } else if (system.state == "face") {
                        if (system.framecount % 100 === 0) {
                            impulsX = Math.random() * 800 - 400;
                            impulsY = -Math.random() * 400;

						    transitions[1]();
                            system.random = false; 
                        }
                    } else if (system.state == "talking") {
                        if (system.framecount % 100 === 0) {
                            impulsX = Math.random() * 800 - 400;
                            impulsY = -Math.random() * 400;

						    transitions[1](); //TODO:: alternate
                            system.random = false; 
                        }
                    } else if (system.state == "disperse") {

                        impulsX = 0;
                        impulsY = 0;
                        transitions[2]();
                        system.state = null;
                    }
                   
                };

                /**
                 * set system state
                 * @param newState String
                 */
                system.setState = function (newState) {
                    system.state = newState;
                };

            };

		return ParticleSystem;
    });
