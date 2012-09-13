/*global define $*/
define(['graphicalweb/models/VarsModel', 'graphicalweb/events/UserEvent', 'graphicalweb/events/StateEvent', 'graphicalweb/views/components/CharButton'],

	function (VarsModel, UserEvent, StateEvent, CharButton) {
		
		var HUD = function () {
			var instance = this,
                $charbtns,
                navButtons = [];

//private
            
            
//public

            instance.init = function () {
                var button;

                $charbtns = $('.char-btn');
                
                $charbtns.each(function () {
                    button = new CharButton($(this)[0]);
                    navButtons.push(button);
                });

                $charbtns.bind('mouseover', function () {
                    var id = $(this).data('id') - 2;
                    navButtons[id].mouseover();
                });

                $charbtns.bind('mouseout', function () {
                    var id = $(this).data('id') - 2;
                    navButtons[id].mouseout();
                });

                $charbtns.bind('click', function () {
                    var id = $(this).data('id');
                    if (navButtons[id - 2].locked !== true || VarsModel.PRESENTATION === true) {
                        UserEvent.NAV_CLICK.dispatch(id);
                    }
                });
            };

            /**
             * @param btn int - button to unlock up to
             */
            instance.unlock = function (btn) {
                var i = 0;

                for (i; i < btn + 1; i += 1) {

                    if (navButtons[i].locked === true && i <= navButtons.length) {
                        navButtons[i].unlock();
                    }

                    navButtons[i].draw();
                }
                
            };

            instance.init();
        };

		return new HUD();
    });
