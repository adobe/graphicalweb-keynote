define(['graphicalweb/events/StateEvent'],

	function (StateEvent) {
		
		var Section1_DIV = function () {
			var instance = this,
                stateId = 1,
                phase,
                $view;

//private
            
            function handle_intro_CLICK(e) {
                instance.stop();
            }

            function update() {

            }
            
//public
            instance.init = function () {
                //$view = $('#introView');
                StateEvent.SECTION_READY.dispatch(stateId);

                phase = 0;
            };

            instance.start = function () {
                _log('start section 1');
            };

            instance.stop = function () {
            
            };

            instance.destroy = function () {
                //StateEvent.INTRO_END.dispatch();
            };
		};

		return new Section1_DIV();
    });
