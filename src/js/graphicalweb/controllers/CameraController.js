define(['graphicalweb/events/UserEvent', 'graphicalweb/utils/CSS3Helper'],

	function (UserEvent, CSS3Helper) {
		
		var CameraController = function () {
			var instance = this,
                $camera,
                $scene,
                $window,
                data,
                DEFAULT_PERSPECTIVE = {value: 300},//1000000
                DEFAULT_ROTATION = {x: 0, y: 0, z: 0},
                DEFAULT_ZOOM = {value: 1},
                DEFAULT_ROLL = {value: 0},
                DEFAULT_POSITION = {x: 0, y: 0, z: 0},
                SHIFT = false,
                ALT = false,
                moveAmount = 1,
                translateString = '',
                rotateString = '',
                zoomString = '',
                rollString = '';

            instance.perspective = copyObj(DEFAULT_PERSPECTIVE);
            instance.position = copyObj(DEFAULT_POSITION);
            instance.rotation = copyObj(DEFAULT_ROTATION);
            instance.zoom = copyObj(DEFAULT_ZOOM);
            instance.roll = copyObj(DEFAULT_ROLL);

//private

            function copyObj(obj) {
                var newObj = {},
                    attr;

                for (attr in obj) {
                    if (obj.hasOwnProperty(attr)) {
                        newObj[attr] = obj[attr];
                    }
                }

                return newObj;
            }

            function update() {

                if (DEBUG !== false) {
                    data.position_x = instance.position.x;
                    data.position_y = instance.position.y;
                    data.position_z = instance.position.z;
                    data.rotation_x = instance.rotation.x;
                    data.rotation_y = instance.rotation.y;
                    data.rotation_z = instance.rotation.z;
                }
                
                translateString = 'translate3d(' + instance.position.x + 'px, ' + instance.position.y + 'px, ' + instance.position.z + 'px)';
                rotateString = 'rotateX(' + instance.rotation.x + 'deg) rotateY(' + instance.rotation.y + 'deg) rotateZ(' + instance.rotation.z + 'deg)';
                rollString = 'rotate(' + instance.roll.value + 'deg)';
                
                if (instance.zoom.value > 0) {
                    zoomString = 'scale(' + instance.zoom.value + ')';
                } 

                //rotating swivels camera
                //CSS3Helper.setTransform($scene[0], translateString);             //translation uses scene
                //CSS3Helper.setTransform($camera[0], rotateString + zoomString);  //rotation uses camera
                
                //rotating translates scene
                CSS3Helper.setTransform($scene[0], translateString + rotateString);             //translation uses scene
                //roll/zoom adjusts camera
                CSS3Helper.setTransform($camera[0], rollString + zoomString);

                if (CSS3Helper.getPerspective($camera[0]) != instance.perspective.value) {
                    CSS3Helper.setPerspective($camera[0], instance.perspective.value);
                }
            }

            function keyRotation(keycode) {
                switch (keycode) {
                case 87: //W
                    instance.rotation.x -= moveAmount;
                    break;
                case 68: //D
                    instance.rotation.y -= moveAmount;
                    break;
                case 83: //S
                    instance.rotation.x += moveAmount;
                    break;
                case 65: //A
                    instance.rotation.y += moveAmount;
                    break;
                case 81: //Q
                    instance.rotation.z += moveAmount;
                    break;
                case 69: //E
                    instance.rotation.z -= moveAmount;
                    break;
                }

                update();
            }

            function keyPosition(keycode) {
                switch (keycode) {
                case 87: //W
                    instance.position.y += moveAmount;
                    break;
                case 68: //D
                    instance.position.x -= moveAmount;
                    break;
                case 83: //S
                    instance.position.y -= moveAmount;
                    break;
                case 65: //A
                    instance.position.x += moveAmount;
                    break;
                case 81: //Q
                    instance.position.z += moveAmount;
                    break;
                case 69: //E
                    instance.position.z -= moveAmount;
                    break;
                case 187:
                    instance.zoom.value += 0.1;
                    break;
                case 189:
                    instance.zoom.value -= 0.1;
                    break;
                case 16:
                    SHIFT = true;
                    break;
                case 18:
                    ALT = true;
                    break;
                }

                update();
            }

            function handle_document_KEY_DOWN(e) {

                //console.log(ALT, SHIFT, e.keyCode);

                if (SHIFT !== false) {
                    moveAmount = 10;        
                } else {
                    moveAmount = 1;
                }

                if (ALT !== false) {
                    keyRotation(e.keyCode);
                    return;
                }

                keyPosition(e.keyCode);
            }

            function handle_document_KEY_UP(e) {
                switch (e.keyCode) {
                case 16:
                    SHIFT = false;
                    break;
                case 18:
                    ALT = false;
                    break;
                }
            }

            //function handle_RESIZE() {
            //    $camera.css({width: $window.width(), height: $window.height()});
            //}
            
//public
			instance.init = function () {

                if (DEBUG === true) {
                    var DebugData,
                        gui;

                    DebugData = function () {
                        this.position_x = 0;
                        this.position_y = 0;
                        this.position_z = 0;
                        this.rotation_x = 0;
                        this.rotation_y = 0;
                        this.rotation_z = 0;
                    };

                    data = new DebugData();
                    if (typeof(dat) !== 'undefined') {
                        gui = new dat.GUI();
                        gui.add(data, 'position_x').listen();
                        gui.add(data, 'position_y').listen();
                        gui.add(data, 'position_z').listen();
                        gui.add(data, 'rotation_x').listen();
                        gui.add(data, 'rotation_y').listen();
                        gui.add(data, 'rotation_z').listen();
                    }
                    
                    UserEvent.KEY_DOWN.add(handle_document_KEY_DOWN);
                    UserEvent.KEY_UP.add(handle_document_KEY_UP);
                }
                
                $camera = $('#camera');
                $scene = $('#scene');
                $window = $(window);

                instance.setPosition({x: 0, y: -768, z: 0});     //initial camera position
            };

            instance.update = function () {
                update();
            };

            instance.show = function () {
                $camera.show();            
            };


            //DEFAUTS
            instance.reset = function (duration) {
                instance.defaultZoom(duration);
                instance.defaultRotation(duration);
                instance.defaultPerspective(duration);
            };

            instance.defaultZoom = function (duration) {
                instance.setZoom(copyObj(DEFAULT_ZOOM));
                //instance.animateZoom(copyObj(DEFAULT_ZOOM), duration);
            };

            instance.defaultRotation = function (duration) {
                instance.setRotation(copyObj(DEFAULT_ROTATION));
                //instance.animateRotation(copyObj(DEFAULT_ROTATION), duration);
            };

            instance.defaultPerspective = function (duration) {
                instance.setPerspective(copyObj(DEFAULT_PERSPECTIVE));
                //instance.animatePerspective(copyObj(DEFAULT_PERSPECTIVE), duration);
            };

            //SETTERS
            instance.setPosition = function (newPosition) {
                instance.position = newPosition;
                update();
            };

            instance.setRotation = function (newRotation) {
                instance.rotation = newRotation;
                update();
            };

            instance.setPerspective = function (p) {
                instance.perspective = p;
            };

            instance.setZoom = function (newZoom) {
                instance.zoom = newZoom;
            }

            //ANIMATION
            instance.animate = function (start, end, duration, params) {

                if (typeof(params) !== 'undefined') {
                    params.delay = typeof(params.delay) == 'undefined' ? 0 : params.delay;
                    params.easing = typeof(params.easing) == 'undefined' ? TWEEN.Easing.Linear.EaseNone : params.easing;
                } else {
                    params = {};
                    params.delay = 0;
                    params.easing = TWEEN.Easing.Linear.EaseNone;
                }

                new TWEEN.Tween(start)
                    .to(end, duration)
                    .delay(params.delay)
                    .easing(params.easing)
                    .onUpdate(function () {
                        update();
                    })
                    .onComplete(function () {
                        if (typeof(params.callback) == 'function') {
                            params.callback();
                        }
                    })
                    .start();
            };

            instance.animatePosition = function (goalPosition, duration, params) {
                instance.animate(instance.position, goalPosition, duration, params);
            };

            instance.animateRotation = function (goalRotation, duration, params) {
                instance.animate(instance.rotation, goalRotation, duration, params);
            };

            instance.animatePerspective = function (goalPerspective, duration, params) {
                instance.animate(instance.perspective, goalPerspective, duration, params);
            };

            instance.animateZoom = function (goalZoom, duration, params) {
                instance.animate(instance.zoom, goalZoom, duration, params);
            };

        };

		return new CameraController();
    });
