define(['graphicalweb/events/StateEvent', 'graphicalweb/views/components/CharButton'],

	function (StateEvent, CharButton) {
		
		var HUD = function () {
			var instance = this,
                navButtons = [];

//private
            
            
//public
            instance.init = function () {
                var button;
                
                $('.char-btn').each(function () {
                    button = new CharButton($(this)[0]);
                    navButtons.push(button);
                });
            };

            /**
             * @param btn int - button to unlock
             */
            instance.unlock = function (btn) {
                navButtons[btn].unlock();
            };

            instance.init();
        };

		return new HUD();
    });
