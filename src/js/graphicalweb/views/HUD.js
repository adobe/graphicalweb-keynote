/*global define $*/
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
             * @param btn int - button to unlock up to
             */
            instance.unlock = function (btn) {
                var i = 0;

                for (i; i < btn + 1; i += 1) {
                    if (navButtons[i].locked === true) {
                        navButtons[i].unlock();
                    }
                }
                
            };

            instance.init();
        };

		return new HUD();
    });
