/*global define, $, TWEEN */
define(['text!graphicalweb/views/html/scenery.html',
        'graphicalweb/controllers/CameraController',
        'graphicalweb/models/AssetModel',
        'graphicalweb/utils/CSS3Helper'
        ],

	function (scenery_html, 
        Camera, 
        AssetModel,
        CSS3Helper) {
		
		var Scenery = function () {
			var instance = this,
                USE_CANVAS = true,
                curvy = false,
                frame = 0,
                goalFrame = 0,
                bgposition = 0,
                delta = {x: -200},
                elementcount = 5,
                parallaxitems,
                terrainInterval,
                $body,
                $container,
                $clouds,
                canvas,
                ctx,
                parallaxA = [],
                imgList = [];
                
//private

            /**
             * draw using one canvas
             */
            function draw() {
                var i = 4,
                    img,
                    pattern,
                    num;

                ctx.clearRect(0, 0, canvas.width, canvas.height);

                for (i; i > -1; i -= 1) {
                    img = imgList[i][frame];
                    pattern = ctx.createPattern(img, 'repeat-x');
                    ctx.fillStyle = pattern;
                    ctx.rect(0, 0, canvas.width, canvas.height);
                    ctx.fill();
                    //ctx.drawImage(img, 0, 0);
                }
            }

            /*
            //draw using multiple canvas elements (for parallax?)
            function draw() {
                var i = 0,
                    img,
                    pattern,
                    num,
                    canvas,
                    ctx;

                for (i; i < parallaxA.length; i += 1) {
                    canvas = parallaxA[i].canvas;
                    ctx = parallaxA[i].context;
                    img = imgList[i][frame];
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    pattern = ctx.createPattern(img, 'repeat-x');
                    ctx.fillStyle = pattern;
                    ctx.rect(0, 0, canvas.width, canvas.height);
                    ctx.fill();
                }
            }
            */

            function parallax() {
                var i = 0,
                    item,
                    offset;

                for (i; i < parallaxitems.length; i += 1) {
                    item = parallaxitems[i];
                    offset = $(parallaxitems[i]).data('offset');
                    CSS3Helper.setTransform(item, 'translate(' + (delta.x * offset) + 'px, 0px)');
                }
            }

            function updateTerrain() {
                if (frame > goalFrame) {
                    frame -= 1;
                } else if (frame < goalFrame) {
                    frame += 1;
                } else {
                    return;
                }

                draw();
                setTimeout(updateTerrain, 20);
            }

            function setupImageList() {
                var i = 0,
                    num = 0,
                    j, 
                    arr;

                for (i; i < 5; i += 1) {
                    j = 0;
                    arr = [];
                    for (j; j < 10; j += 1) {
                        arr.push(AssetModel.groundA[num].img);
                        num += 1;
                    }
                    imgList.push(arr);
                }
            }
          
//public
            instance.init = function () {
                var i = 0,
                    element;

                $body = $('body');
                $container = $('#layer1');
                $clouds = $('#cloudsA');

                _log(USE_CANVAS);

                //Determine if Canvas or SVG
                if (USE_CANVAS !== true) {
                    parallaxitems = $('#parallaxA').find('.parallax-item');
                } else {
                    canvas = $('#groundA1')[0];
                    ctx = canvas.getContext('2d');

                    AssetModel.loadGroup(1, function () {
                        setupImageList();
                        draw();    
                    });
                }
            };

            instance.animateParallax = function (goal, duration) {
                if (USE_CANVAS !== true) {
                    var end = {x: goal};

                    new TWEEN.Tween(delta)
                        .to(end, duration)
                        .onUpdate(parallax)
                        .start();
                }
            };

            instance.update = function () {
                //bgposition -= 0.2;
                //$clouds.css({backgroundPosition: bgposition + 'px 0px'});
            };

    //state methods

            instance.addColor = function () {
                $body.addClass('css');
                $body.removeClass('space');

                goalFrame = 4;
                updateTerrain();
            };

            instance.addCurves = function () {
                $body.addClass('css');
                $body.removeClass('space');

                goalFrame = 9;
                updateTerrain();

            };

            instance.addSpace = function () {
                $body.addClass('space');

                goalFrame = 9;
                updateTerrain();
            };

            instance.removeAll = function () {
                $body.removeClass('space');
                $body.removeClass('css');

                goalFrame = 0;
                updateTerrain();
            };

		};

		return new Scenery();
    });
