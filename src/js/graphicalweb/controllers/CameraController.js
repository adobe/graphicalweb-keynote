define(['graphicalweb/events/UserEvent'],

	function (UserEvent) {
		
		var CameraController = function () {
			var instance = this,
                SHIFT = false,
                moveAmount = 1;

            instance.position = {x: 0, y: 0, z: 0};
            instance.rotation = {x: 0, y: 0, z: 0};

//private
            
            function handle_document_KEY_DOWN(e) {

                console.log(e.keyCode);

                if (SHIFT !== false) {
                    moveAmount = 10;        
                } else {
                    moveAmount = 1;
                }

                switch (e.keyCode) {
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
                case 16:
                    SHIFT = true;
                    break;
                }
            }

            function handle_document_KEY_UP(e) {
                if (e.keyCode == 16) {
                    SHIFT = false;
                }
            }
            
//public

			instance.init = function () {

                if (DEBUG === true) {
                    UserEvent.KEY_DOWN.add(handle_document_KEY_DOWN);
                    UserEvent.KEY_UP.add(handle_document_KEY_UP);
                }

            };

            instance.setPosition = function (x, y, z) {
                instance.position.x = x;
                instance.position.y = y;
                instance.position.z = z;
            };
		
        };

		return new CameraController();
    });
