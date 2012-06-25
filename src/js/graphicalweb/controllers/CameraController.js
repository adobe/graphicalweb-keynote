define(['graphicalweb/events/UserEvent'],

	function (UserEvent) {
		
		var CameraController = function () {
			var instance = this;

            instance.position = {x: 0, y: 0, z: 0};
            instance.rotation = {x: 0, y: 0, z: 0};

//private
            function handle_document_KEY_DOWN(e) {
                console.log('camera key press', e.keyCode);

                switch (e.keyCode) {
                case 87: //W
                    //z ++
                    break;
                case 68: //D
                    //x ++
                    break;
                case 83: //S
                    //z --
                    break;
                case 65: //A
                    //x --
                    break;
                case 81: //Q
                    //y ++
                    break;
                case 69: //E
                    //y --
                    break;
                }
            }
            
//public
			instance.init = function () {

                if (DEBUG === true) {
                    UserEvent.KEY_DOWN.add(handle_document_KEY_DOWN);
                }

            };
		};

		return new CameraController();
    });
