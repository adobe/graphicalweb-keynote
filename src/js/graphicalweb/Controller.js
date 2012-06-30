define(['graphicalweb/events/UserEvent', 'graphicalweb/events/StateEvent', 
        'graphicalweb/controllers/CameraController'],

	function (UserEvent, StateEvent, Camera) {
		
		var Controller = function (view, model) {
			var instance = this,
                History,
                $window,
                $document;

//private

    //event handlers
            function handle_PRELOAD_COMPLETE(e) {
                view.showIntro();
            }

            function handle_INTRO_END() {
                view.gotoSection(1);
                History.pushState({state: 1}, 'div', 'div');
            }

            function handle_STATE_CHANGE() {
                var State = History.getState(); // Note: We are using History.getState() instead of event.state
                
                _log('state CHANGE-----------------');
                History.log(State.data, State.title, State.url);
            }

            /**
             * handle key down for next/previous
             */
            function handle_document_KEY_DOWN(e) {
                switch (e.keyCode) {
                case 39:
                    UserEvent.NEXT.dispatch();
                    break;
                case 37:
                    UserEvent.PREVIOUS.dispatch();
                    break;
                }
            }

            function handle_window_RESIZE(e) {
                //TODO:: handle resizing window
            }

    //event triggers
            function trigger_KEY_DOWN(e) {
                UserEvent.KEY_DOWN.dispatch(e);   
            }

            function trigger_KEY_UP(e) {
                UserEvent.KEY_UP.dispatch(e);   
            }

            function trigger_RESIZE() {
                UserEvent.RESIZE.dispatch();
            }

            function trigger_STATE_CHANGE() {
                StateEvent.STATE_CHANGE.dispatch();
            }

//public
            instance.init = function () {
                $document = $(document);
                $window = $(window);

                Camera.init();
                
                //set up events
                $document.bind('keydown', trigger_KEY_DOWN);
                $document.bind('keyup', trigger_KEY_UP);
                $window.resize(trigger_RESIZE);
                
                UserEvent.RESIZE.add(handle_window_RESIZE);
                UserEvent.KEY_DOWN.add(handle_document_KEY_DOWN);
                
                StateEvent.PRELOAD_COMPLETE.add(handle_PRELOAD_COMPLETE);
                StateEvent.INTRO_END.add(handle_INTRO_END);
                
                //TODO: remove fake trigger of load complete methods

                $document.ready(function (e) {
                    setTimeout(function () {
                        StateEvent.PRELOAD_COMPLETE.dispatch(e);
                        setTimeout(function () {
                            StateEvent.LOAD_COMPLETE.dispatch();
                        }, 1000);
                    }, 1000);
                });

                //HISTORY
                History = window.History; // Note: We are using a capital H instead of a lower h
                History.Adapter.bind(window, 'statechange', trigger_STATE_CHANGE);
                StateEvent.STATE_CHANGE.add(handle_STATE_CHANGE);

                _log('state INIT-----------------');
                var State = History.getState();
                History.log(State.data, State.title, State.url);
            };

            instance.init();
		};

		return Controller;
    });
