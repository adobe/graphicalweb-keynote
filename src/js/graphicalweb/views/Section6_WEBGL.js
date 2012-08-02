/*global define, THREE, TWEEN, _log, $ */

define(['graphicalweb/events/StateEvent',
        'graphicalweb/controllers/CameraController',
        'graphicalweb/views/components/Div',
        'text!graphicalweb/views/shaders/GalaxyVShader.vs',
        'text!graphicalweb/views/shaders/GalaxyFShader.fs'],

	function (StateEvent, Camera, Div, vertShader, fragShader) {
		
		var Section4_3D = function () {
			var instance = this,
                stateId = 6,
                $container,
                $cover,
                $view,
                _width,
                _height,
                interval,
                renderer,
                scene,
                camera,
                material,
                monolith,
                bg,
                uniforms,
                attributes;

            instance.phaselength = 0;
            instance.phase = 0;

//private

            function update() {
                //_log('webgl update');
                
                monolith.rotation.x += 0.01;
                monolith.rotation.y += 0.02;

                //bg.rotation.x += 0.01;
                //bg.rotation.y += 0.01;

                uniforms.time.value += 0.01;
 
                renderer.render(scene, camera);
            }

            function handle_animIn_COMPLETE() {
                StateEvent.SECTION_ANIM_IN_COMPLETE.dispatch(stateId);    
                instance.start();
                $container.fadeIn(200);
                //TODO:: monolith move in
            }

            /**
             * setup webgl scene
             */
            function setupWEBGL() {
                var cube,
                    cubeMaterial,
                    plane,
                    planeMaterial,
                    ambientLight,
                    directionalLight;

                scene = new THREE.Scene();
				camera = new THREE.PerspectiveCamera(75, _width / _height, 1, 10000);
				camera.position.z = 1000;
				scene.add(camera);

                //monolith
                cube = new THREE.CubeGeometry(200, 150, 50);
                cubeMaterial = new THREE.MeshLambertMaterial({color: 0x222222});
                monolith = new THREE.Mesh(cube, cubeMaterial);
                //TODO:: position off screen
                scene.add(monolith);

                //bg
				uniforms = {
					time: {type: "f", value: 1.0},
					resolution: {type: "v2", value: new THREE.Vector2(_width, _height)}
				};

				planeMaterial = new THREE.ShaderMaterial({
					uniforms: uniforms,
					vertexShader: vertShader,
					fragmentShader: fragShader,
                    transparent: true
				});

                //planeMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});

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

				renderer = new THREE.WebGLRenderer();
                renderer.setSize(_width, _height);
                $container.html(renderer.domElement);

            }


//public
            instance.init = function () {
                instance.phase = 0;
                
                _width = window.innerWidth;
                _height = window.innerHeight;
                $container = $('#charWebgl');

                setupWEBGL();
                
                StateEvent.SECTION_READY.dispatch(stateId);
            };

            instance.animIn = function (direct) {

                var goalPosition = {x: 5390, y: 5312, z: -5980},
                    goalRotation = {x: 30, y: -97, z: 0},
                    divPosition = {x: 8500, y: -2150, z: 4500},
                    divRotation = {x: -100, y: 70, z: 90};

                if (direct) {
                    Camera.setPosition(goalPosition);  
                    Camera.setRotation(goalRotation);
                    Div.setPosition(divPosition);
                } else {
                    Camera.animateRotation(goalRotation, 1000);
                    Camera.animatePosition(goalPosition, 1000, {easing: TWEEN.Easing.Quadratic.EaseInOut});
                    Div.animatePosition(divPosition, 2000, {easing: TWEEN.Easing.Sinusoidal.EaseIn});
                    Div.animateRotation(divRotation, 2000, {callback: handle_animIn_COMPLETE});
                }
            };

            instance.next = function () {
                instance.phase += 1;

                //TODO:: sequence through
            };

            instance.start = function () {
                interval = setInterval(update, 1000 / 60);
            };

            instance.stop = function () {
                clearInterval(interval);
                $container.fadeOut(200, instance.destroy);
            };

            instance.destroy = function () {
                StateEvent.SECTION_DESTROY.dispatch();
            };
		};

		return new Section4_3D();
    });
