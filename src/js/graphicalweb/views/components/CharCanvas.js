define(['graphicalweb/utils/CSS3Helper'],

	function (CSS3Helper) {

		//THIS IS BASICALLY A PARTICLE MACHINE
		var CharCanvas = function () {
			var instance = this,
                $canvas,
                canvas,
                ParticleMachine,
                Particle,
                transitions,
                _width = window.innerWidth,
                _height = window.innerHeight,
                ctx;

            instance.visible = false;
//private

            
            Particle = function () {
                this.x = Math.random() * _width;
                this.x = _height / 2;
                this.toX = 0;
                this.toY = _height / 2;
                this.color = Math.random() * 200 + 55;
                this.angle = Math.random() * Math.PI * 2;
                this.size = 0;
                this.toSize = Math.random() * 4 + 1;
            };

            ParticleMachine = function () {
                var numParticles = 100,
                i,
                mx = 0,
                my = 0,
                impulsX = 0,
                impulsY = 0,
                impulsToX = 0,
                impulsToY = 0,
                startedAt,
                p = Processing(canvas),
                now,
                machine,
                machineIndex = 0,
                play = false,
                pixels = [],
                focusedParticleIndex = null;

                this.pixels = pixels;

                for (i = 0; i < numParticles; i += 1) {
                    pixels[i] = new Particle();
                    pixels[i].toX = pixels[i].x;
                    pixels[i].speedX = 0;
                    pixels[i].speedY = 0;
                }

                transitions = [
                    // random position
                    function () {
                        for (i = 0; i < pixels.length; i += 1) {
                            var p = pixels[i];
                            if (p.flightMode != 2) {
                                p.toX = Math.random() * _width;
                                p.toY = Math.random() * _height;
                                p.speedX = Math.cos(p.angle) * Math.random() * 3;
                                p.speedY = Math.sin(p.angle) * Math.random() * 3; 
                            }
                        }
                    },
                    // white flash
                    function () {
                        for (i = 0; i < pixels.length; i += 1) {
                            var p = pixels[i];
                            if (p.flightMode != 2) {
                                p.r = 255;
                                p.g = 255;
                                p.b = 255;
                                p.size = Math.random() * 50 + 50;
                            }
                        }
                    },
                    // change size
                    function () {
                        for (i = 0; i < pixels.length; i += 1) {
                            var p = pixels[i];
                            if (p.flightMode != 2) {
                                p.toSize = Math.random() * 10 + 1;
                            }
                        }
                    },
                    // circle shape
                    function () {
                        var r = Math.floor(Math.random() * 250 + 100),
                        p;
                        for (i = 0; i < pixels.length; i += 1) {
                            p = pixels[i];
                            if (p.flightMode != 2) {
                                p.toSize = Math.random() * 4 + 1;
                                p.toX = _width / 2 + Math.cos(i * 3.6 * Math.PI / 180) * r;
                                p.toY = _height / 2 + Math.sin(i * 3.6 * Math.PI / 180) * r;
                                impulsX = 0;
                                impulsY = 0;
                                p.speedX = (Math.random() - 0.5) / 2;
                                p.speedY = (Math.random() - 0.5) / 2; 
                                p.toR = Math.random() * 255;
                                p.toG = Math.random() * 255;
                                p.toB = Math.random() * 255;
                            }
                        }
                    },

                    // heart
                    function () {
                        var heart = [[707, 359], [707, 359], [707, 359], [707, 359], [708, 358], [711, 354], [713, 352], [714, 348], [716, 345], [720, 335], [721, 334], [722, 333], [724, 332], [725, 330], [727, 327], [731, 322],  [734, 320], [737, 318], [740, 314], [743, 312], [745, 311], [749, 309], [753, 308], [757, 306], [761, 303], [764, 302], [767, 302], [771, 301], [774, 301], [778, 301], [783, 301], [786, 301], [790, 300], [796, 300], [801, 300], [805, 300], [809, 300], [811, 300], [815, 302], [817, 303], [820, 305], [822, 306], [824, 307], [827, 309], [830, 311], [834, 313], [836, 314], [838, 316], [841, 318], [844, 321], [845, 324], [847, 326], [849, 328], [852, 332], [853, 334], [855, 336], [857, 337], [858, 339], [860, 341], [862, 345], [863, 349], [863, 352], [864, 356], [864, 359], [865, 362], [866, 364], [868, 368], [869, 372], [870, 377], [871, 381], [872, 384], [872, 388], [872, 392], [872, 395], [872, 399], [872, 401], [872, 405], [872, 409], [871, 412], [870, 417], [869, 419], [869, 422], [867, 427], [866, 429], [865, 434], [863, 438], [862, 442], [861, 443], [860, 445], [857, 448], [854, 451], [852, 454], [849, 456], [846, 459], [843, 460], [836, 466], [835, 466], [833, 467], [821, 475], [820, 477], [819, 478], [817, 481], [815, 483], [811, 486], [808, 487], [803, 491], [802, 491], [800, 492], [795, 493], [791, 497], [789, 498], [786, 498], [780, 502], [772, 507], [770, 510], [767, 511], [762, 516], [758, 520], [756, 524], [753, 527], [750, 529], [746, 532], [741, 534], [736, 537], [732, 538], [731, 539], [735, 537], [735, 537], [735, 537], [730, 543], [729, 546], [727, 551], [726, 553], [723, 555], [721, 558], [715, 568], [714, 570], [714, 572], [713, 575], [708, 585], [708, 586], [707, 586], [704, 583], [704, 359], [704, 359], [700, 356], [698, 352], [697, 350], [696, 345], [694, 343], [693, 340], [690, 335], [688, 335], [687, 334], [683, 332], [681, 329], [677, 326], [675, 323], [672, 319], [669, 314], [668, 312], [663, 310], [660, 310], [656, 310], [653, 309], [647, 309], [644, 308], [642, 308], [637, 307], [632, 303], [628, 301], [624, 297], [621, 297], [619, 297], [616, 297], [616, 298], [616, 299], [614, 300], [620, 302], [620, 302], [620, 302], [618, 302], [612, 302], [605, 302], [598, 302], [596, 303], [594, 305], [592, 307], [590, 309], [586, 310], [583, 313], [582, 315], [579, 319], [576, 320], [573, 323], [571, 325], [569, 327], [563, 329], [560, 333], [558, 336], [557, 338], [556, 341], [555, 343], [551, 346], [549, 349], [549, 354], [549, 357], [547, 361], [546, 367], [543, 372], [542, 375], [541, 380], [540, 381], [540, 382], [540, 382], [540, 382], [540, 382], [540, 384], [540, 386], [540, 389], [539, 391], [539, 394], [539, 398], [539, 404], [539, 408], [539, 412], [539, 416], [540, 423], [542, 428], [544, 433], [549, 436], [552, 439], [555, 442], [557, 445], [560, 448], [562, 452], [564, 459], [565, 461], [560, 449], [560, 449], [561, 450], [571, 458], [580, 466], [584, 469], [587, 473], [589, 476], [591, 477], [575, 466], [575, 466], [575, 466], [576, 466], [582, 471], [587, 475], [590, 477], [594, 481], [598, 484], [601, 489], [604, 491], [607, 495], [611, 496], [617, 498], [622, 500], [626, 501], [629, 504], [633, 508], [636, 510], [642, 515], [650, 522], [651, 525], [655, 528], [657, 529], [660, 530], [663, 530], [667, 533], [671, 534], [676, 536], [679, 537], [681, 539], [683, 540], [676, 536], [676, 536], [676, 536], [679, 539], [684, 546], [687, 548], [689, 551], [692, 554], [696, 558], [698, 563], [701, 567], [702, 571], [704, 574], [705, 577], [706, 579], [707, 580], [708, 582],  [709, 586]],
                            p;
                        impulsX = 0;
                        impulsY = 0;
                        for (i = 0; i < pixels.length; i += 1) {
                            p = pixels[i];
                            if (p.flightMode != 2) {
                                p.toX = heart[Math.floor(i * 3.6) % heart.length][0] - 200;
                                p.toY = heart[Math.floor(i * 3.6) % heart.length][1] - 150;
                                p.speedX = (Math.random() - 0.5) / 2;
                                p.speedY = (Math.random() - 0.5) / 2; 
                            }
                        }
                    }
                ];


                this.update = function () {
                    var a,  b,  c, 
                        alpha, 
                        transIndex, 
                        r1,  r2;

                    impulsX = impulsX + (impulsToX - impulsX) / 30;
					impulsY = impulsY + (impulsToY - impulsY) / 30;

					// move to tox
					for (i = 0; i < pixels.length; i += 1) {
						pixels[i].x = pixels[i].x + (pixels[i].toX - pixels[i].x) / 10;
						pixels[i].y = pixels[i].y + (pixels[i].toY - pixels[i].y) / 10;
						pixels[i].size = pixels[i].size + (pixels[i].toSize - pixels[i].size) / 10;

						pixels[i].r = pixels[i].r + (pixels[i].toR - pixels[i].r) / 10;
						pixels[i].g = pixels[i].g + (pixels[i].toG - pixels[i].g) / 10;
						pixels[i].b = pixels[i].b + (pixels[i].toB - pixels[i].b) / 10;
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
                        pixels[r1].size = Math.random() * 30;
                    }
					
                    if (pixels[r2].flightMode != 2) 
                    {
                        pixels[r2].size = Math.random() * 30;
                    }

					this.framecount += 1;

					now = new Date();
					if (now.getTime() - startedAt.getTime() >= machine[machineIndex]) {
						machineIndex += 1;
						impulsX = Math.random() * 800 - 400;
						impulsY = -Math.random() * 400;

						transIndex = Math.floor(Math.random() * transitions.length);
						transitions[transIndex]();
					}				

                };

                this.draw = function () {	
	//				p.stroke(255, 0, 0);
	//				p.ellipse(p.mouseX+5, p.mouseY+5, 5, 5);

					for (i = 0; i < pixels.length; i += 1) {
						p.fill(Math.floor(pixels[i].r), Math.floor(pixels[i].g), Math.floor(pixels[i].b));
						p.ellipse(pixels[i].x, pixels[i].y, pixels[i].size, pixels[i].size);
	//					console.log(pixels[i].x);
					}

					if (focusedParticleIndex !== null) {
						p.fill(Math.floor(pixels[focusedParticleIndex].r), Math.floor(pixels[focusedParticleIndex].g), Math.floor(pixels[focusedParticleIndex].b));
						p.ellipse(pixels[focusedParticleIndex].x, pixels[focusedParticleIndex].y, pixels[focusedParticleIndex].size, pixels[focusedParticleIndex].size);				
					}
				}

            };

            
            function draw() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }

//public
			instance.init = function () {
                $canvas = $('#charCanvas');
                canvas = $canvas[0];
                ctx = $canvas[0].getContext('2d');

                draw();
            };

            instance.stars = function () {
                if (instance.visible === false) {
                    $canvas.show();
                    instance.visible = true;
                }

                //TODO:: draw star particles

            };

            instance.drawFace = function () {
                //TODO:: particles draw face
            };

            instance.init();
		};

		return new CharCanvas();
    });
