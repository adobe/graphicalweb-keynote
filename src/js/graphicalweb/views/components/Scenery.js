define(['text!graphicalweb/views/html/scenery.html',
        'graphicalweb/controllers/CameraController',
        'graphicalweb/utils/CSS3Helper',
        'text!graphicalweb/views/svg/scene1.svg',
        'text!graphicalweb/views/svg/scene2.svg',
        'text!graphicalweb/views/svg/scene3.svg'],

	function (scenery_html, 
        Camera, 
        CSS3Helper, 
        svg, svg2, svg3) {
		
		var Scenery = function () {
			var instance = this,
                canvas,
                ctx,
                $container;
                
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
                $('#cube1 .side').html(svg);
                //$('#cube2 .side').html(svg2);
                //$('#cube3 .side').html(svg3);

                //draw();

                Camera.show();
            };

            instance.addColor = function () {
                $('body').addClass('css');
            };

            instance.addCurves = function () {
                //setTimeout(function () {

                //    $('.animation').each(function () {
                //        _log('ANIMATE2', $(this)[0]);
                //        $(this)[0].beginElement();
                //    });

                //}, 100);

            };
		};

		return new Scenery();
    });
