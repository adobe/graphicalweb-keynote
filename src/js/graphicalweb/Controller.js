/*global define $ TWEEN requestAnimationFrame*/
define(['graphicalweb/events/UserEvent', 
        'graphicalweb/events/StateEvent', 
        'graphicalweb/controllers/CameraController',
        'graphicalweb/controllers/AudioController',
        'graphicalweb/models/AssetModel',
        'graphicalweb/models/VarsModel'],

	function (UserEvent, StateEvent, Camera, Audio, AssetModel, VarsModel) {
		
		var Controller = function (view, model) {
			var instance = this,
                History,
                State,
                transitioning = false,
                $window,
                $document;

//private

    //event handlers

            //function handle_SECTION_READY(e) {
            //    view.startSection();
            //}
            
            function handle_SCENERY_LOADED() {
                //TODO:: hide preloader

                var initialState = model.getCurrentState();
                $('#preloader').hide();
                view.gotoSection(initialState.id);
            }
            
            function handle_ANIM_IN_COMPLETE(e) {
                transitioning = false;
            }

            function handle_SECTION_DESTROY(e) {
                view.initSection();
            }

            function handle_STATE_CHANGE(e) {
                var newSection;

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

                if (VarsModel.SOUND !== false) {
                    Audio.stopDialogue();
                }

                if (currentView.phase == currentView.phaselength || VarsModel.PRESENTATION !== true) {
                    if (transitioning !== true && currentState.id < 8) {
                        transitioning = true;
                        nextState = model.getStateByInt(currentState.id + 1);
                        model.setCurrentState(nextState.id);

                        History.pushState(null, null, nextState.url);
                    }
                } else {
                    currentView.next();
                }
            }

            function handle_PREVIOUS() {
                var currentState,
                    prevState;

                currentState = model.getCurrentState();
                prevState = model.getStateByInt(currentState.id - 1);

                if (transitioning !== true && prevState.id !== 0) {
                    transitioning = true;

                    if (VarsModel.SOUND !== false) {
                        Audio.stopDialogue();
                    }

                    model.setCurrentState(prevState.id);
                    History.pushState(null, null, prevState.url);
                }
            }

            function handle_NAV_CLICK(id) {
                var state = model.getStateByInt(id);
                model.setCurrentState(state.id);
                History.pushState(null, null, state.url);
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
                //StateEvent.SECTION_READY.add(handle_SECTION_READY);
                StateEvent.SECTION_ANIM_IN_COMPLETE.add(handle_ANIM_IN_COMPLETE);
                StateEvent.SECTION_DESTROY.add(handle_SECTION_DESTROY);
            }

            /**
             * update animations
             */
            function update() {
                requestAnimationFrame(update);
                TWEEN.update();
                view.update();
            }

            /**
             * setup initial state based on uri
             * TODO:: uri may need to be fixed if using more complex uri structure
             */
            function setupInitialState() {
                var initialState,
                    uri = window.location.pathname;

                uri = uri !== '/' ? uri.replace('/', '') : uri;                 
                initialState = model.getStateByURL(uri);

                if (typeof(initialState) !== 'undefined' && initialState.id > 0) {
                    StateEvent.SCENE_LOADED.add(handle_SCENERY_LOADED);
                    AssetModel.loadScene();

                    model.setCurrentState(initialState.id);
                    //view.gotoSection(initialState.id);
                } else {
                    model.setCurrentState(0);
                    view.gotoSection(0);
                }
            }

//public
            instance.init = function () {
                $document = $(document);
                $window = $(window);

                view.setViewList(model.getViewList());
                view.init();

                //set up events
                $document.bind('keydown', function (e) {
                    UserEvent.KEY_DOWN.dispatch(e);
                });

                $document.bind('keyup', function (e) {
                    UserEvent.KEY_UP.dispatch(e);
                });

                $('#key-right').bind('click', function () {
                    UserEvent.NEXT.dispatch();
                });

                $('#key-left').bind('click', function () {
                    UserEvent.PREVIOUS.dispatch();
                });

                $document.bind('touchstart', function () {
                    UserEvent.NEXT.dispatch();
                });

                $('.info-btn').bind('click', function () {
                    
                });

                $window.resize(function () {
                    UserEvent.RESIZE.dispatch();
                });
                
                UserEvent.NAV_CLICK.add(handle_NAV_CLICK);
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
