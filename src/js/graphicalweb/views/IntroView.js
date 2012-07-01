define(['graphicalweb/events/StateEvent', 'graphicalweb/events/UserEvent', 'text!graphicalweb/views/html/intro.html'],

	function (StateEvent, UserEvent, intro_html) {
		
		var IntroView = function () {
			var instance = this,
                stateId = 0,
                $view,
                $bg,
                $cover,
                $startCopy;

//private
            
            function handle_intro_CLICK(e) {
                //TODO:: dispatch next event
                UserEvent.NEXT.dispatch();
            }

            //function handle_LOAD_COMPLETE() {
            //    $startcopy.fadein();
            //    $view.one('click', handle_intro_click);
            //}

            function update() {

            }
            
//public
            instance.init = function () {
                $view = $('#introView');
                $bg = $('#introBg');
                $cover = $('#cover');
                $startCopy = $('#startCopy');

                //TODO:: ensure scenery is hidden
                
                $bg.html(intro_html);
                
                StateEvent.SECTION_READY.dispatch(stateId);
             
                $startCopy.fadeIn();
                $view.one('click', handle_intro_CLICK);
            };

            instance.start = function () {
                $view.fadeIn();
            };

            instance.stop = function () {
                $cover.fadeIn(instance.destroy);  
            };

            instance.destroy = function () {
                $bg.empty();
                $view.hide();
                StateEvent.SECTION_DESTROY.dispatch(stateId);

                //TODO:: ensure scenery is visible
            };
		};

		return new IntroView();
    });
