define(['graphicalweb/events/UserEvent', 'graphicalweb/utils/CSS3Helper'],

	function (UserEvent, CSS3Helper) {
		
		var CameraController = function () {
			var instance = this,
                $camera,
                $scene,
                $window,
                data,
                SHIFT = false,
                ALT = false,
                moveAmount = 1,
                translateString = '',
                rotateString = '',
                zoomString = '';

            instance.position = {x: 0, y: 0, z: 0};
            instance.rotation = {x: 0, y: 0, z: 0};
            instance.zoom = 1;

//private

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

                if (instance.zoom > 0) {
                    zoomString = 'scale(' + instance.zoom + ')';
                } 

                CSS3Helper.setTransform($scene[0], translateString);             //translation uses scene
                CSS3Helper.setTransform($camera[0], rotateString + zoomString);  //rotation uses camera
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
                    instance.zoom += 0.1;
                    break;
                case 189:
                    instance.zoom -= 0.1;
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

                instance.setPosition(0, -768, 0);     //initial camera position       
            };

            instance.update = function () {
                update();
            }

            instance.show = function () {
                $camera.show();
            };

            instance.setPosition = function (x, y, z) {
                instance.position.x = x;
                instance.position.y = y;
                instance.position.z = z;

                update();
            };

            instance.setRotation = function (x, y, z) {
                instance.rotation.x = x;
                instance.rotation.y = y;
                instance.rotation.z = z;

                update();
            };

            instance.setPerspective = function (p) {
                instance.perspective = p;
            }
		
        };

		return new CameraController();
    });
