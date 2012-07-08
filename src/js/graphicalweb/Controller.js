define(['graphicalweb/events/UserEvent', 'graphicalweb/events/StateEvent', 
        'graphicalweb/controllers/CameraController'],

	function (UserEvent, StateEvent, Camera) {
		
		var Controller = function (view, model) {
			var instance = this,
                History,
                State,
                $window,
                $document;

//private

    //event handlers

            function handle_SECTION_READY(e) {
                view.startSection();
            }

            function handle_SECTION_DESTROY(e) {
                view.initSection();
            }

            function handle_STATE_CHANGE(e) {
                var newSection;

                //State = History.getState();
                //History.log(State.data, State.title, State.url);

                newSection = model.getCurrentState();
                view.gotoSection(newSection.id);
            }

            /**
             * if not at last phase, iterate through view's phases
             */
            function handle_NEXT() {
                var currentState,
                    currentView,
                    nextState,
                    stateList;

                stateList = model.getStates();
                currentState = model.getCurrentState();
                currentView = stateList[currentState.id].view;

                if (currentView.phase == currentView.phaselength) {
                    nextState = model.getStateByInt(currentState.id + 1);
                    model.setCurrentState(nextState.id);

                    History.pushState(null, null, nextState.url);
                } else {
                    currentView.next();
                }
            }

            function handle_PREVIOUS() {
                var currentState,
                    prevState;

                _log('previous');
                currentState = model.getCurrentState();
                prevState = model.getStateByInt(currentState.id - 1);
                model.setCurrentState(prevState.id);

                History.pushState(null, null, prevState.url);
            }

            function handle_window_RESIZE(e) {
                //TODO:: handle resizing window
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

    //event triggers
            
            function setupStateManager() {
                History = window.History; // Note: We are using a capital H instead of a lower h
                History.Adapter.bind(window, 'statechange', function (e) {
                    StateEvent.STATE_CHANGE.dispatch(e);
                });
                StateEvent.STATE_CHANGE.add(handle_STATE_CHANGE);
                StateEvent.SECTION_READY.add(handle_SECTION_READY);
                StateEvent.SECTION_DESTROY.add(handle_SECTION_DESTROY);
            }


            /**
             * update animations
             */
            function update() {
                _log('update');
                requestAnimationFrame(update);
                TWEEN.update();
            }

            /**
             * setup initial state based on uri
             * TODO:: uri may need to be fixed if using more complex uri structure
             */
            function setupInitialState() {
                var initialState,
                    uri = window.location.pathname;

                //State = History.getState();
                //History.log(State.data, State.title, State.url);

                uri = uri !== '/' ? uri.replace('/', '') : uri;                 
                initialState = model.getStateByURL(uri);

                if (typeof(initialState) !== 'undefined') {
                    model.setCurrentState(initialState.id);
                    view.gotoSection(initialState.id);
                }
            }

//public
            instance.init = function () {
                $document = $(document);
                $window = $(window);

                Camera.init();
                
                //set up events
                $document.bind('keydown', function (e) {
                    UserEvent.KEY_DOWN.dispatch(e);
                });
                $document.bind('keyup', function (e) {
                    UserEvent.KEY_UP.dispatch(e);
                });
                $window.resize(function () {
                    UserEvent.RESIZE.dispatch();
                });
                
                UserEvent.RESIZE.add(handle_window_RESIZE);
                UserEvent.KEY_DOWN.add(handle_document_KEY_DOWN);
                UserEvent.NEXT.add(handle_NEXT);
                UserEvent.PREVIOUS.add(handle_PREVIOUS);
                
                setupStateManager();
                setupInitialState();

                update();
            };

            instance.init();
		};

		return Controller;
    });
