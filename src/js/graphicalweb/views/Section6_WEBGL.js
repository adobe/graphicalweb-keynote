/*global define, THREE, TWEEN, _log, $ Modernizr*/

define(['graphicalweb/events/StateEvent',
        'graphicalweb/events/UserEvent',
        'graphicalweb/models/VarsModel',       
        'graphicalweb/controllers/CameraController',
        'graphicalweb/controllers/AudioController',
        'graphicalweb/views/components/Div',
        'text!graphicalweb/views/shaders/GalaxyVShader.vs',
        'text!graphicalweb/views/shaders/GalaxyFShader.fs'],

	function (StateEvent, UserEvent, VarsModel, Camera, Audio, Div, vertShader, fragShader) {
		
		var Section4_3D = function () {
			var instance = this,
                stateId = 6,
                $container,
                $cover,
                $blockquotes,
                view,
                _width,
                _height,
                interval,
                renderer,
                scene,
                camera,
                material,
                monolith,
                monolith_rotate = false,
                meteors = [],
                bg,
                delta = 0,
                rotation_delta = 0,
                uniforms,
                attributes;

            instance.phaselength = 0;
            instance.phase = 0;

//private

            function handle_MOUSE_MOVE(e) {
                if (Modernizr.webgl === true) {
                    var intensity;
                    
                    intensity = e.pageX / (_width * 100);
                    intensity /= e.pageY / (_height * 10);

                    uniforms.intensity.value = intensity;
                }
            }

            function handle_animIn_COMPLETE() {

                StateEvent.SECTION_ANIM_IN_COMPLETE.dispatch(stateId);    
                
                $container.fadeIn(200);

                if (Modernizr.webgl === true) {
                    new TWEEN.Tween(monolith.position).to({x: 0, y: 0, z: 0}, 3000)
                        .delay(1000)
                        .start();

                    new TWEEN.Tween(monolith.rotation).to({x: 0, y: 0, z: 0}, 1000)
                        .delay(4000)
                        .onComplete(function () {
                            monolith_rotate = true; 
                        })
                        .start();
                }

                if (VarsModel.PRESENTATION === true) {
                    instance.next();
                } else {
                    $(view + ':not(blockquote)').show();
                    UserEvent.MOUSE_MOVE.add(handle_MOUSE_MOVE);
                }
            }

            instance.update = function () {
                if (Modernizr.webgl === true) {
                    var i = 0;
                    
                    delta += 0.01;

                    if (monolith_rotate === true) {
                        rotation_delta += 0.01;
                        monolith.rotation.y = Math.sin(rotation_delta) * 0.5;
                        monolith.rotation.x = Math.sin(rotation_delta) * 0.3;
                    }

                    //for (i; i < meteors.length; i += 1) {
                    //    meteors[i].position.x -= meteors[i].velocity;
                    //    meteors[i].position.y -= meteors[i].velocity;

                    //    if (meteors[i].position.x < -2000 || meteors[i].position.y < -2000) {
                    //        meteors[i].position.x += 3000;
                    //        meteors[i].position.y += 3000;
                    //    }
                    //}

                    uniforms.time.value += 0.01;
                    renderer.render(scene, camera);
                }
            };

            /**
             * setup webgl scene
             */
            function setupWEBGL() {
                var cube,
                    cubeMaterial,
                    sphere,
                    sphereMaterial,
                    sphereResolution,
                    plane,
                    planeMaterial,
                    ambientLight,
                    directionalLight,
                    i,
                    meteor;

                scene = new THREE.Scene();
				camera = new THREE.PerspectiveCamera(75, _width / _height, 1, 10000);
				camera.position.z = 1000;
				scene.add(camera);

                //monolith
                cube = new THREE.CubeGeometry(150, 280, 30);
                cubeMaterial = new THREE.MeshLambertMaterial({color: 0x222222});
                monolith = new THREE.Mesh(cube, cubeMaterial);
                monolith.position.y = -100;
                monolith.position.z = 1300;
                monolith.rotation.x = -85 * Math.PI / 180;
                //monolith.position.y = -1000;
                scene.add(monolith);

                //for (i = 0; i < 5; i += 1) {
                //    sphereResolution = 3 + Math.ceil(Math.random() * 2);
                //    sphere = new THREE.SphereGeometry(30 + Math.random() * 50, sphereResolution, sphereResolution);
                //    sphereMaterial = new THREE.MeshLambertMaterial({color: 0xcccccc});
                //    meteor = new THREE.Mesh(sphere, sphereMaterial);
                //    meteor.position.y = -(i * 100) + 1000;
                //    meteor.position.x = i * 300;
                //    meteor.position.z = -200;
                //    meteor.rotation.x = Math.random() * 360;
                //    meteor.velocity = 0.2 + Math.random() * 0.8;
                //    scene.add(meteor);
                //    meteors.push(meteor);
                //}

                //bg
				uniforms = {
					time: {type: "f", value: 1.0},
					intensity: {type: "f", value: 1.0},
					resolution: {type: "v2", value: new THREE.Vector2(_width, _height)}
				};

				planeMaterial = new THREE.ShaderMaterial({
					uniforms: uniforms,
					vertexShader: vertShader,
					fragmentShader: fragShader,
                    transparent: true
				});

				bg = new THREE.Mesh(new THREE.PlaneGeometry(8000, 5000), planeMaterial); 
                bg.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI / 2));
                bg.position.z = -1000;
				scene.add(bg);

                //lights
                ambientLight = new THREE.AmbientLight(0x222222);
                scene.add(ambientLight);
                directionalLight = new THREE.DirectionalLight(0xffffff);
                directionalLight.position.set(1, 1, 1).normalize();
                scene.add(directionalLight);

				renderer = new THREE.WebGLRenderer({clearColor: 0x000000, clearAlpha: 0});
                renderer.setSize(_width, _height);
                $container.html(renderer.domElement);
            }


//public
            instance.init = function () {
                view = '.section6';
                $blockquotes = $('blockquote' + view);

                instance.phase = 0;
                instance.phaselength = $blockquotes.length;
                               
                delta = 0;
                rotation_delta = 0;
                _width = window.innerWidth;
                _height = window.innerHeight;
                $container = $('#charWebgl');
                monolith_rotate = false;

                if (Modernizr.webgl === true) {
                    setupWEBGL();
                } else {
                    $('#warning').fadeIn();
                    $container.replaceWith('<img id="charWebgl" src="./assets/img/characters/webgl.png">');
                    $container = $('#charWebgl');
                }

                StateEvent.SECTION_READY.dispatch(stateId);
            };

            instance.animIn = function (direct) {

                //var goalPosition = {x: 5390, y: 5312, z: 5980},
                //    goalRotation = {x: 30, y: -180, z: 0},
                var goalPosition = {x: -1690, y: 4549, z: -4450},
                    goalRotation = {x: 7, y: -97, z: 0},
                    //divPosition = {x: 5500, y: -8500, z: 2500},
                    //divRotation = {x: 30, y: -180, z: 0};
                    divPosition = {x: 1500, y: -5350, z: 4600},
                    divRotation = {x: 0, y: 90, z: 0};

                if (direct) {
                    Camera.setPosition(goalPosition);  
                    Camera.setRotation(goalRotation);
                    Div.setPosition(divPosition);
                    Div.setRotation(divRotation);
                    handle_animIn_COMPLETE();
                } else {
                    Camera.animateRotation(goalRotation, 1000);
                    Camera.animatePosition(goalPosition, 2000, {delay: 500, easing: TWEEN.Easing.Quadratic.EaseInOut, callback: handle_animIn_COMPLETE});
                    Div.animatePosition(divPosition, 1000, {easing: TWEEN.Easing.Sinusoidal.EaseOut});
                    Div.animateRotation(divRotation, 1000);
                }
            };

            instance.run = function () {
                var $currentQuote = $($blockquotes[instance.phase - 1]);
                
                $blockquotes.fadeOut();

                switch (instance.phase) {
                case 1:
                    //webgl iam
                    StateEvent.AUTOMATING.dispatch();         
                    Div.setFace('happy');                   
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        StateEvent.WAIT_FOR_INTERACTION.dispatch();
                    });
                    break;
                case 2:
                    //ready i am
                    StateEvent.AUTOMATING.dispatch();         
                    Div.setFace('talk');                   
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        Div.setFace('happy');                   
                        UserEvent.NEXT.dispatch();
                    });
                    break;
                case 3:
                    //try
                    Div.setFace('happy');                   
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        UserEvent.NEXT.dispatch();
                    });
                    break;
                }
            };

            instance.prev = function () {
                instance.phase -= 1;
                instance.run();
            };
            
            instance.next = function () {
                instance.phase += 1;
                instance.run();
            };

            instance.stop = function () {
                clearInterval(interval);
                $(view).hide();
                $container.fadeOut(200, instance.destroy);
                UserEvent.MOUSE_MOVE.remove(handle_MOUSE_MOVE);
            };

            instance.destroy = function () {
                StateEvent.SECTION_DESTROY.dispatch();
            };
		};

		return new Section4_3D();
    });
