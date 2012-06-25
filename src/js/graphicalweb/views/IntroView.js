define(['graphicalweb/events/StateEvent'],

	function (StateEvent) {
		
		var IntroView = function () {
			var instance = this,
                $view,
                $cover;

//private
            
            function handle_intro_CLICK(e) {
                instance.stop();
            }
            
//public
            instance.init = function () {
                $view = $('#introView');
                $cover = $('#cover');
            };

            instance.start = function () {
                $view.fadeIn();
                $view.one('click', handle_intro_CLICK);
            };

            instance.stop = function () {
                console.log('stop');
                $cover.fadeIn(instance.destroy);
            };

            instance.destroy = function () {
                StateEvent.INTRO_END.dispatch();
            };
		};

		return new IntroView();
    });
