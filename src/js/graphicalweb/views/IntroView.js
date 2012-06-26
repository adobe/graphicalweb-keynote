define(['graphicalweb/events/StateEvent', 'text!graphicalweb/views/html/intro.html'],

	function (StateEvent, intro_html) {
		
		var IntroView = function () {
			var instance = this,
                $view,
                $bg,
                $cover;

//private
            
            function handle_intro_CLICK(e) {
                instance.stop();
            }

            function update() {

            }
            
//public
            instance.init = function () {
                $view = $('#introView');
                $bg = $('#introBg');
                $cover = $('#cover');

                console.log(intro_html);
                $bg.append(intro_html);
            };

            instance.start = function () {
                $view.fadeIn();
                $view.one('click', handle_intro_CLICK);
            };

            instance.stop = function () {
                $cover.fadeIn(instance.destroy);
            };

            instance.destroy = function () {
                StateEvent.INTRO_END.dispatch();
                $bg.empty();
            };
		};

		return new IntroView();
    });
