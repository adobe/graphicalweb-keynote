define(['graphicalweb/events/UserEvent', 'graphicalweb/events/StateEvent', 'graphicalweb/controllers/CameraController'],

	function (UserEvent, StateEvent, Camera) {
		
		var Controller = function (view, model) {
			var instance = this,
                $document;

//private

    //event handlers
            function handle_PRELOAD_COMPLETE(e) {
                view.showIntro();
            }

            function handle_INTRO_END() {
                view.gotoSection(0);
            }

            function handle_window_RESIZE(e) {
                //TODO:: handle resizing window
            }

    //event triggers
            function trigger_KEY_DOWN(e) {
                UserEvent.KEY_DOWN.dispatch(e);   
            }

//public
            instance.init = function () {
                $document = $(document);

                UserEvent.RESIZE.add(handle_window_RESIZE);
                StateEvent.PRELOAD_COMPLETE.add(handle_PRELOAD_COMPLETE);
                StateEvent.INTRO_END.add(handle_INTRO_END);
                
                $document.bind('keydown', trigger_KEY_DOWN);

                //TODO: remove fake trigger of load complete methods
                $document.ready(function (e) {
                    setTimeout(function () {
                        StateEvent.PRELOAD_COMPLETE.dispatch(e);
                        setTimeout(function () {
                            StateEvent.LOAD_COMPLETE.dispatch();
                        }, 1000);
                    }, 1000);
                });
                
                Camera.init();
            };

            instance.init();
		};

		return Controller;
    });
