define(['graphicalweb/events/StateEvent'],

	function (StateEvent) {
		
		var Section1_DIV = function () {
			var instance = this,
                stateId = 1,
                phase,
                $cover,
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
                $cover = $('#cover');

                if ($cover.is(':visible')) {
                    $cover.fadeOut();
                }

                _log('start section 1');
            };

            instance.stop = function () {
                instance.destroy();
            };

            instance.destroy = function () {
                StateEvent.SECTION_DESTROY.dispatch();
            };
		};

		return new Section1_DIV();
    });
