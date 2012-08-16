/*global $ define*/

define(['graphicalweb/utils/CSS3Helper', 'graphicalweb/views/components/BaseCharacter'],

	function (CSS3Helper, BaseCharacter) {
		
		var CharBlend = function () {
			var instance = this,
                container,
                circle3,
                delta = 0;

//private
            function update() {
                delta += 1;
            }
            
//public
            instance.prototype = new BaseCharacter();
            
            instance.prototype.WIDTH = 81;
            instance.prototype.HEIGHT = 55;
            instance.prototype.NUM_COLUMNS = 10;
            instance.prototype.anim_map = [
                {name: 'idle1', min: 0, max: 20},
                {name: 'idle2', min: 21, max: 41},
                {name: 'talk1', min: 42, max: 62},
                {name: 'talk2', min: 63, max: 83}
            ];
            instance.prototype.idle_maps = [0, 1];
            instance.prototype.talk_maps = [2, 3];
            instance.prototype.talk = false;

            instance.init = function () {
                container = $('#charBlend');
                instance.prototype.element = container.find('.face');
            };

            instance.start = instance.prototype.start;
            instance.stop = instance.prototype.stop;

            instance.talk = function (value) {
                instance.prototype.talk = value;
            };
			
            instance.fadeIn = function () {
                container.fadeIn(200, function () {
                    container.css({'left': '1000px'});
                });
            };

            instance.fadeOut = function () {
                container.fadeOut();
            };


            instance.init();
		};

		return CharBlend;
    });
