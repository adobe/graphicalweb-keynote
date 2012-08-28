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

		
		ParticleSystem = function (w, h) {
                var system = this,
                i,
                mx = 0,
                my = 0,
                impulsX = 0,
                impulsY = 0,
                impulsToX = 0,
                impulsToY = 0,
                transitions,
                transition,
                talkstate = 0,
                now,
                startedAt = new Date(),
                pixels = [];

                _width = w ? w : _width;
                _height = h ? h : _height;

                console.log('?', _width, _height);

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

                function lineDistance(point1, point2)
                {
                    var xs = 0,
                        ys = 0;

                    xs = point2.x - point1.x;
                    xs = xs * xs;
                    ys = point2.y - point1.y;
                    ys = ys * ys;
                    return Math.sqrt(xs + ys);
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
                    var pointList = [[624, 335], [631, 337], [627, 347], [617, 342], [620, 338], [613, 349], [803, 378], [811, 368], [818, 375], [812, 385], [803, 383], [807, 369], [573, 437], [587, 441], [591, 445], [603, 448], [613, 451], [627, 456], [638, 459], [657, 465], [666, 468], [694, 472], [712, 476], [734, 482], [746, 484], [765, 488], [777, 490], [797, 495], [801, 496], [812, 499], [807, 514], [796, 531], [785, 541], [766, 563], [744, 583], [723, 594], [706, 599], [676, 606], [656, 608], [620, 602], [607, 597], [587, 586], [574, 577], [564, 561], [554, 544], [552, 520], [552, 506], [553, 487], [554, 472], [554, 457], [553, 447], [552, 431], [560, 432], [679, 471], [723, 480], [775, 552], [756, 574], [733, 589], [688, 602], [635, 607], [550, 532], [783, 493]],
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

                function transition_talking() {
                    var pointList,
                        one = [[624, 335], [631, 337], [627, 347], [617, 342], [620, 338], [613, 349], [803, 378], [811, 368], [818, 375], [812, 385], [803, 383], [807, 369], [573, 437], [587, 441], [591, 445], [603, 448], [613, 451], [627, 456], [638, 459], [657, 465], [666, 468], [694, 472], [712, 476], [734, 482], [746, 484], [765, 488], [777, 490], [797, 495], [801, 496], [812, 499], [807, 512], [796, 519], [785, 523], [762, 528], [746, 528], [724, 528], [712, 526], [695, 523], [687, 522], [664, 517], [656, 513], [648, 511], [634, 508], [627, 502], [616, 496], [597, 485], [589, 479], [581, 471], [573, 466], [565, 455], [558, 444], [552, 431], [560, 432], [679, 471], [723, 480], [773, 525], [757, 530], [735, 528], [702, 525], [675, 519], [607, 492], [783, 493]],
                        two = [[624, 335], [631, 337], [627, 347], [617, 342], [620, 338], [613, 349], [803, 378], [811, 368], [818, 375], [812, 385], [803, 383], [807, 369], [573, 437], [587, 441], [591, 445], [603, 448], [613, 451], [627, 456], [638, 459], [657, 465], [666, 468], [694, 472], [712, 476], [734, 482], [746, 484], [765, 488], [777, 490], [797, 495], [801, 496], [812, 499], [807, 512], [800, 507], [793, 506], [775, 512], [760, 510], [738, 506], [732, 503], [708, 499], [700, 496], [677, 495], [668, 489], [659, 486], [646, 485], [638, 479], [629, 475], [611, 472], [600, 462], [591, 458], [580, 453], [571, 449], [555, 444], [552, 431], [560, 432], [679, 471], [723, 480], [785, 507], [767, 510], [747, 508], [720, 500], [689, 493], [619, 473], [783, 493]],
                        three = [[624, 335], [631, 337], [627, 347], [617, 342], [620, 338], [613, 349], [803, 378], [811, 368], [818, 375], [812, 385], [803, 383], [807, 369], [573, 437], [590, 445], [597, 449], [607, 455], [623, 458], [639, 453], [649, 445], [660, 443], [673, 441], [699, 447], [706, 455], [723, 470], [730, 474], [741, 482], [754, 487], [769, 491], [782, 496], [795, 501], [807, 512], [800, 507], [793, 506], [776, 504], [756, 500], [732, 492], [724, 495], [710, 510], [705, 501], [683, 517], [665, 523], [650, 520], [642, 512], [636, 500], [630, 487], [615, 470], [600, 462], [591, 458], [580, 453], [571, 449], [555, 444], [552, 431], [560, 432], [686, 442], [716, 462], [785, 507], [766, 503], [744, 495], [718, 496], [697, 509], [626, 477], [759, 491]],
                        four = [[624, 335], [631, 337], [627, 347], [617, 342], [620, 338], [613, 349], [803, 378], [811, 368], [818, 375], [812, 385], [803, 383], [807, 369], [573, 437], [587, 441], [591, 445], [603, 448], [613, 451], [627, 456], [638, 459], [657, 465], [666, 468], [694, 472], [712, 476], [734, 482], [746, 484], [765, 488], [777, 490], [797, 495], [801, 496], [812, 499], [807, 514], [796, 531], [785, 541], [766, 563], [744, 583], [723, 594], [706, 599], [676, 606], [656, 608], [620, 602], [607, 597], [587, 586], [574, 577], [564, 561], [554, 544], [552, 520], [552, 506], [553, 487], [554, 472], [554, 457], [553, 447], [552, 431], [560, 432], [679, 471], [723, 480], [775, 552], [756, 574], [733, 589], [688, 602], [635, 607], [550, 532], [783, 493]],
                        pointArrays = [one, two, four, three],
                        p;

                    talkstate = talkstate < pointArrays.length ? talkstate + 1 : 1;
                    pointList = pointArrays[talkstate - 1];

                    impulsX = 0;
                    impulsY = 0;
                    
                    for (i = 0; i < pixels.length; i += 1) {
                        p = pixels[i];
                        if (p.flightMode != 2) {
                            
                            p.toX = pointList[Math.floor(i * 3.6) % pointList.length][0] - 200 + Math.random() * 10;
                            p.toY = pointList[Math.floor(i * 3.6) % pointList.length][1] - 150 + Math.random() * 10;
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
                            p.speedX = (Math.random() - 0.5) / 2;
                            p.speedY = (Math.random() - 0.5) / 2; 
                        }
                    }
                }

                function transition_circle() {
                    for (i = 0; i < pixels.length; i += 1) {
                        var p = pixels[i];
                        if (p.flightMode != 2) {
                            p.toX = 10 + Math.random() * _width - 20;
                            p.toY = 10 + Math.random() * _height - 20;
                            p.speedX = 0;
                            p.speedY = 0; 
                        }
                    }
                }

                transitions = [
                    transition_random,
                    transition_face,
                    transition_disperse,
                    transition_talking,
                    transition_circle
                ];

                //UPDATE METHOD
                system.update = function () {
                    var a,  b,  c, 
                        alpha, 
                        transIndex;

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

                            if (system.state == 'circle') {

                            } else {
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
						}

                        if (system.state !== "stars" && system.state !== 'circle') {
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
                        if (system.framecount % 10 === 0) {
                            impulsX = Math.random() * 800 - 400;
                            impulsY = -Math.random() * 400;
						    transitions[3]();
                            system.random = false; 
                        }
                    } else if (system.state == 'circle') {
                        impulsX = 0;
                        impulsY = 0;
                        transitions[4]();
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
