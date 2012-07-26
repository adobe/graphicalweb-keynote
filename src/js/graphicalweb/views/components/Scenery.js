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
                USE_CANVAS = false,
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
                parallaxA = [],
                imgList = [];
                
//private
            function draw() {
                var i = 0,
                    img,
                    pattern,
                    num,
                    canvas,
                    ctx;

                for (i; i < parallaxA.length; i += 1) {
                    //num = i + 1;
                    
                    canvas = parallaxA[i].canvas;
                    ctx = parallaxA[i].context;
                    
                    img = imgList[i][frame];

                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    pattern = ctx.createPattern(img, 'repeat-x');
                    ctx.fillStyle = pattern;
                    ctx.rect(0, 0, canvas.width, canvas.height);
                    ctx.fill();

                    //ctx.drawImage(img, 0, 0);
                }
            }

            function parallax() {
                var i = 0,
                    item,
                    offset;

                //TODO:: not in ios
                for (i; i < parallaxitems.length; i += 1) {
                    //item = parallaxA[i].canvas;
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
                    ctx,
                    element;

                $body = $('body');
                $container = $('#background');
                $clouds = $('#cloudsA');


                //TODO:: determine if svg supported or not if not use one canvas
                
                parallaxitems = $('#parallaxA').find('.parallax-item');

                //setup canvases
                for (i; i < elementcount; i += 1) {
                    element = $('#groundA' + (i + 1))[0];
                    ctx = element.getContext('2d');
                    parallaxA[i] = {canvas: element, context: ctx};
                }

                AssetModel.loadGroup(1, function () {
                    setupImageList();
                    draw();    
                });
            };

            instance.animateParallax = function (goal, duration) {
                var end = {x: goal};

                new TWEEN.Tween(delta)
                    .to(end, duration)
                    .onUpdate(parallax)
                    .start();
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
