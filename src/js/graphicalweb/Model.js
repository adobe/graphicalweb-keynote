define(['graphicalweb/views/IntroView',
        'graphicalweb/views/Section1_DIV',
        'graphicalweb/views/Section2_CSS',
        'graphicalweb/views/Section3_SVG'],

	function (IntroView, 
        Section1_DIV, 
        Section2_CSS, 
        Section3_SVG) {
		
		var Model = function () {
			var instance = this,
            currentState,
            states = [
                {id: 0, title: 'Intro', url: '/', view: IntroView},
                {id: 1, title: 'Div', url: 'meet-div', view: Section1_DIV}, 
                {id: 2, title: 'CSS', url: 'meet-css', view: Section2_CSS},
                {id: 3, title: 'SVG', url: 'meet-svg', view: Section3_SVG}
            ];

            instance.TITLE = '';

//private
           

//public
			instance.init = function () {
                instance.TITLE = $('title').text();
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
             * @return states Array
             */
            instance.getStates = function () {
                return states;
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
