define([],

	function () {
		
		var UserEvent = {
            KEY_DOWN: new signals.Signal(),
            KEY_UP: new signals.Signal(),
            MOUSE_MOVE: new signals.Signal(),
            RESIZE: new signals.Signal()
        };

		return UserEvent;
    });
