/*global $ define TWEEN */
define(['graphicalweb/utils/CSS3Helper', 'text!graphicalweb/views/svg/charDIV.svg', 'graphicalweb/models/VarsModel'],

	function (CSS3Helper, svg, VarsModel) {
		
		var Div = function () {
			var instance = this,
                $container,
                interval,
                //width = 80,
                //num_columns = 10,
                //num_frames,
                //row, 
                //col,
                //currframe = 0,
                //nextmap = 0,
                //currmap = 0,
                //state = '',
                //anim_map = [
                //    {name: '', min: 0, max: 19},
                //    {name: 'blink', min: 20, max: 38},
                //    {name: 'talk', min: 39, max: 57},
                //    {name: 'bored', min: 57, max: 76},
                //    {name: 'happy', min: 77, max: 95},
                //    {name: 'interested', min: 96, max: 113}
                //],
                //idle_maps = [0, 1],
                //bored_maps = [0, 1, 3],
                //happy_maps = [0, 1, 4],
                translateString,
                rotateString;

            //instance.looping = false;
            //instance.bored = false;
            instance.position = {x: 800, y: 0, z: 0};
            instance.rotation = {x: 0, y: 0, z: 0};

//private

            /*
             * update for tween
             */
            function update() {
                translateString = 'translate3d(' + instance.position.x + 'px, ' + instance.position.y + 'px, ' + instance.position.z + 'px)';
                rotateString = 'rotateX(' + instance.rotation.x + 'deg) rotateY(' + instance.rotation.y + 'deg) rotateZ(' + instance.rotation.z + 'deg)';
                CSS3Helper.setTransform($container[0], translateString + rotateString);             //translation uses scene
            }

            //function spriteUpdate() {
            //    var randomidle,
            //        default_maps = instance.bored ? bored_maps : happy_maps;

            //    currframe += 1;
            //    
            //    if (currframe == anim_map[currmap].max) {
            //        
            //        if (currmap !== nextmap && nextmap !== 0) {
            //            currmap = nextmap;
            //        } else if (instance.looping !== true) {
            //            nextmap = 0;
            //            randomidle = Math.floor(Math.random() * default_maps.length);
            //            currmap = default_maps[randomidle];
            //        } 

            //        currframe = anim_map[currmap].min;
            //    } 

            //    row = Math.floor(currframe / 10);
            //    col = currframe % 10;
            //    
            //    $container.css({backgroundPosition: (-col * width) + 'px ' + (-row * width) + 'px'});
            //}
            
//public

			instance.init = function () {
                $container = $('#charDIV');
                $container.html(svg);

                if (VarsModel.DETAILS === true) {
                    $container.addClass('animating');
                }

                update();
                //instance.start();
            };

            /*
             * update based on requestanimframe
             */
            instance.update = function () {

            };

            //instance.start = function () {
            //    //interval = setInterval(spriteUpdate, 50);
            //};

            //instance.stop = function () {
            //    //clearInterval(interval);
            //};

            //SETTERS

            //TODO:: remove
            instance.setFace = function (personality) {
                if (VarsModel.DETAILS === true) {
                    if (personality === 'talk') {
                        $container.addClass('talking');
                    } else {
                        $container.removeClass('talking');
                    }
                }
            }

            instance.setPosition = function (newPosition) {
                instance.position = newPosition;
                update();
            };

            instance.setRotation = function (newRotation) {
                instance.rotation = newRotation;
                update();
            };

            //ANIMATION
            instance.animate = function (start, end, duration, params) {

                if (typeof(params) !== 'undefined') {
                    params.delay = typeof(params.delay) == 'undefined' ? 0 : params.delay;
                    params.easing = typeof(params.easing) == 'undefined' ? TWEEN.Easing.Linear.EaseNone : params.easing;
                } else {
                    params = {};
                    params.delay = 0;
                    params.easing = TWEEN.Easing.Linear.EaseNone;
                }

                new TWEEN.Tween(start)
                    .to(end, duration)
                    .delay(params.delay)
                    .easing(params.easing)
                    .onUpdate(function () {
                        update();
                    })
                    .onComplete(function () {
                        if (typeof(params.callback) == 'function') {
                            params.callback();
                        }
                    })
                    .start();
            };

            instance.animatePosition = function (goalPosition, duration, params) {
                instance.animate(instance.position, goalPosition, duration, params);
            };

            instance.animateRotation = function (goalRotation, duration, params) {
                instance.animate(instance.rotation, goalRotation, duration, params);
            };

            instance.init();
		};

		return new Div();
    });
