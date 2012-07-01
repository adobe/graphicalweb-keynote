define([],

	function () {
		
		var Model = function () {
			var instance = this,
            currentState,
            states = [
                {id: 0, title: 'Intro', url: '/'},
                {id: 1, title: 'Div', url: 'meet-div'}, 
                {id: 2, title: 'CSS', url: 'meet-css'}
            ];

            instance.GLOBAL_TITLE;

//private
           

//public
			instance.init = function () {
                instance.GLOBAL_TITLE = $('title').text();
            };

            /**
             * get state by title
             * @param title String
             * @return state Object
             */
            instance.getStateByTitle = function (t) {
                var i = 0;
                for (i; i < states.length; i += 1) {
                    if (states[i].title == t) {
                        return states[i];
                    }
                }
            };

            /**
             * @param url String
             * @return state Object
             */
            instance.getStateByURL = function (url) {
                var i = 0;
                for (i; i < states.length; i += 1) {
                    if (states[i].url == url) {
                        return states[i];
                    }
                }
            };

            /**
             * get state by section
             * @param num int
             * @return state Object
             */
            instance.getStateByInt = function (num) {
                return states[num];
            };

            /**
             * @return state Object
             */
            instance.getCurrentState = function () {
                return states[currentState];
            };

            /**
             * @param newState int
             */
            instance.setCurrentState = function (newState) {
                currentState = newState;
            };

            instance.init();
		};

		return Model;
    });
