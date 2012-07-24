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
                delta = {x: 0},
                elementcount = 5,
                $body,
                $container,
                parallaxA = [];
                
//private
            function draw() {
                var i = 0,
                    img,
                    num,
                    canvas,
                    ctx;

                for (i; i < parallaxA.length; i += 1) {
                    num = i + 1;
                    
                    canvas = parallaxA[i].canvas;
                    ctx = parallaxA[i].context;
                    
                    img = new Image();
                    img.src = 'img/terrain/groundA' + num + '/groundA' + num + '_' + frame + '.png';

                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0);
                }
            }

            function animate() {
                var i = 0,
                    item;

                //TODO:: not in ios
                for (i; i < elementcount; i += 1) {
                    item = parallaxA[i].canvas;
                    CSS3Helper.setTransform(item, 'translate(' + (delta.x * i) + 'px, 0px)');
                }
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

                AssetModel.loadGroup(1, draw);
            };

            instance.animateParallax = function (goal, duration) {
                var end = {x: goal};

                new TWEEN.Tween(delta)
                    .to(end, duration)
                    .onUpdate(animate)
                    .start();
            };

            instance.addColor = function () {
                $body.addClass('css');
            };

            instance.addCurves = function () {
                _log('addcurves');
                
                if (curvy !== true) {
                    //$('animate').each(function () {
                    //    $(this)[0].beginElement();
                    //    curvy = true;
                    //});
                }
            };

            instance.addSpace = function () {
                $body.addClass('space');
            };

            instance.removeSpace = function () {
                $body.removeClass('space');
            };

            instance.removeColor = function () {
                $body.removeClass('css');
            };

            instance.removeCurves = function () {
                //TODO:: reverse animation
            };

		};

		return new Scenery();
    });
