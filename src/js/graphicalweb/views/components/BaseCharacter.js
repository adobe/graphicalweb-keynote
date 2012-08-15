/*global $ define */
define([],

	function () {
		
		var BaseCharacter = function () {

			var instance = this,
                row,
                col,
                currframe = 0,
                currmap = 0,
                nextmap = 0,
                interval;

            instance.anim_map = [];
            instance.idle_maps = [];
            instance.talk_maps = [];
            instance.talk = false;
            instance.WIDTH = 80;
            instance.HEIGHT = 80;
            instance.NUM_COLUMNS = 10;

//private
            function update() {
                var anim,
                    default_maps;

                currframe += 1;

                if (currframe == instance.anim_map[currmap].max) {
                    
                    if (instance.talk === true) {
                        default_maps = instance.talk_maps;
                    } else {
                        default_maps = instance.idle_maps;
                    } 

                    anim = Math.floor(Math.random() * default_maps.length);
                    currmap = default_maps[anim];
                    currframe = instance.anim_map[currmap].min;
                }

                row = Math.floor(currframe / 10);
                col = currframe % 10;
                instance.element.css({backgroundPosition: (-col * instance.WIDTH) + 'px ' + (-row * instance.HEIGHT) + 'px'});
            }
            
//public
            instance.start = function () {
                interval = setInterval(update, 70);
            };

            instance.stop = function () {
                clearInterval(interval);
            };

		};

		return BaseCharacter;
    });
