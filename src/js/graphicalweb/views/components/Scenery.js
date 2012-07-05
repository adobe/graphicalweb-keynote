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
                $container;
                
//private
                    
          
//public
            instance.init = function () {
                
                $container = $('#background');
                $container.html(scenery_html);
                $('#cube1 .side').html(svg);
                $('#cube2 .side').html(svg2);
                $('#cube3 .side').html(svg3);

                Camera.show();
            };
		};

		return new Scenery();
    });
