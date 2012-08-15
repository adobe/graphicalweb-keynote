/*global $ define */
define(['graphicalweb/views/components/BaseCharacter'],

	function (BaseCharacter) {
		
        var CharCSS = function () {
            var instance = this;

            instance.prototype = new BaseCharacter();
            
            instance.prototype.element = $('#charCSS');
            instance.prototype.WIDTH = 80;
            instance.prototype.HEIGHT = 80;
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

            instance.talk = function (value) {
                instance.prototype.talk = value;
            }

            instance.start = instance.prototype.start;
            instance.stop = instance.prototype.stop;
		};

        return new CharCSS();
    });
