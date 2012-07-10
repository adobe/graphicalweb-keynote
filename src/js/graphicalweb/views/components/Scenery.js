define(['text!graphicalweb/views/html/scenery.html',
        'graphicalweb/controllers/CameraController',
        'graphicalweb/utils/CSS3Helper',
        'text!graphicalweb/views/svg/scene1.svg',
        'text!graphicalweb/views/svg/scene2.svg',
        'text!graphicalweb/views/svg/scene3.svg',
        'text!graphicalweb/views/svg/scene1_curve.svg',
        'text!graphicalweb/views/svg/scene2_curve.svg'
        ],

	function (scenery_html, 
        Camera, 
        CSS3Helper, 
        grass, 
        hills, 
        hills2, 
        grass_curve,
        hills_curve) {
		
		var Scenery = function () {
			var instance = this,
                canvas,
                ctx,
                $container;

            instance.initted = false;
                
//private
            function draw() {
                ctx.clearRect(canvas.width, canvas.height);
                ctx.fillStyle = "green";
                ctx.fillRect(0, 0, 100, 100);
                //ctx.fill();
            }
          
//public
            instance.init = function () {
                
                $container = $('#background');
                $container.html(scenery_html);
                //canvas = $('<canvas width="200" height="200"></canvas>');
                //ctx = canvas[0].getContext('2d');
                
                //$('#cube1 .side').html(canvas);
                
                $('#cube1 .front').html(grass);
                $('#cube2 .front').html(hills);
                $('#cube3 .front').html(hills2);

                $('#cube1 .back').html(grass);
                $('#cube2 .back').html(hills);
                $('#cube3 .back').html(hills2);

                //draw();

                Camera.show();

                instance.initted = true;
            };

            instance.addColor = function () {
                $('body').addClass('css');
            };

            instance.addCurves = function () {
                $('#cube1 .front').html(grass_curve);
                $('#cube2 .front').html(hills_curve);

                $('#cube1 .back').html(grass_curve);
                $('#cube2 .back').html(hills_curve);

                //setTimeout(function () {
                //    $('.animation').each(function () {
                //        $(this)[0].beginElement();
                //    });
                //}, 100);
            };

            instance.removeColor = function () {
                $('body').removeClass('css');
            };

            instance.removeCurves = function () {
                $('#cube1 .front').html(grass);
                $('#cube2 .front').html(hills);

                $('#cube1 .back').html(grass);
                $('#cube2 .back').html(hills);

            };

		};

		return new Scenery();
    });
