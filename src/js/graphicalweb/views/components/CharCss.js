/*global $ define */
define(['graphicalweb/utils/CSS3Helper'],

	function (CSS3Helper) {
		
		var CharCSS = function () {
			var instance = this,
                element,
                width = 80,
                num_columns = 10,
                num_frames,
                row,
                col,
                currframe = 0,
                currmap = 0,
                nextmap = 0,
                interval,
                anim_map = [
                    {name: 'idle1', min: 0, max: 20},
                    {name: 'idle2', min: 21, max: 41},
                    {name: 'talk1', min: 42, max: 62},
                    {name: 'talk2', min: 63, max: 83}
                ],
                idle_maps = [0, 1],
                talk_maps = [2, 3];

            instance.talk = false;

//private
            function update() {
                var anim,
                    default_maps;

                currframe += 1;

                if (currframe == anim_map[currmap].max) {
                    if (instance.talk === true) {
                        default_maps = talk_maps;
                    } else {
                        default_maps = idle_maps;
                    } 

                    anim = Math.floor(Math.random() * default_maps.length);
                    currmap = default_maps[anim];

                    currframe = anim_map[currmap].min;
                }

                row = Math.floor(currframe / 10);
                col = currframe % 10;
                
                element.css({backgroundPosition: (-col * width) + 'px ' + (-row * width) + 'px'});
            }
            
//public
			instance.init = function () {
                element = $('#charCSS');
            };

            instance.start = function () {
                interval = setInterval(update, 70);
            };

            instance.stop = function () {
                clearInterval(interval);
            };

            instance.init();
		};

		return new CharCSS();
    });
