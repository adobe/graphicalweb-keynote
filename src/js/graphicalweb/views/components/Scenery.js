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
                delta = {x: -200},
                elementcount = 5,
                terrainInterval,
                $body,
                $container,
                parallaxA = [];
                
//private
            function draw() {
                var i = 0,
                    img,
                    pattern,
                    num,
                    canvas,
                    ctx;

                frame = 0;

                for (i; i < parallaxA.length; i += 1) {
                    num = i + 1;
                    
                    canvas = parallaxA[i].canvas;
                    ctx = parallaxA[i].context;
                    
                    img = new Image();
                    img.src = '/img/terrain/groundA' + num + '/groundA' + num + '_' + frame + '.png';

                    _log(canvas, img.src);
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
                    item;

                //TODO:: not in ios
                for (i; i < elementcount; i += 1) {
                    item = parallaxA[i].canvas;
                    CSS3Helper.setTransform(item, 'translate(' + (delta.x * i) + 'px, 0px)');
                }
            }


            function updateTerrain() {

                /*
                if (frame > goalFrame) {
                    frame -= 1;
                } else if (frame < goalFrame) {
                    frame += 1;
                } else {
                    draw();
                    return;
                }

                draw();
                setTimeout(updateTerrain, 10);
                */
            }
          
//public
            instance.init = function () {
                var i = 0,
                    ctx,
                    element;

                $body = $('body');

                //setup canvases
                for (i; i < elementcount; i += 1) {
                    element = $('#groundA' + (i + 1))[0];
                    ctx = element.getContext('2d');
                    parallaxA[i] = {canvas: element, context: ctx};
                }

                AssetModel.loadGroup(1, function() {
                    _log('loaded');
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
                //if (frame > goalFrame) {
                //    frame -= 1;
                //    draw();
                //} else if (frame < goalFrame) {
                //    frame += 1;
                //    draw();
                //}
            }

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

                //if (curvy !== true) {
                    //$('animate').each(function () {
                    //    $(this)[0].beginElement();
                    //    curvy = true;
                    //});
                //}
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
