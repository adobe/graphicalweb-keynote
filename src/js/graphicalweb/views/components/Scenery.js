define(['text!graphicalweb/views/html/scenery.html',
        'graphicalweb/controllers/CameraController',
        'graphicalweb/utils/CSS3Helper'],

	function (scenery_html, Camera, CSS3Helper) {
		
		var Scenery = function () {
			var instance = this,
                $container;
                
//private
                    
          
//public
            instance.init = function () {
                _log('scene init');
                
                $container = $('#background');

                $container.html(scenery_html);
                Camera.show();
            };
		};

		return new Scenery();
    });
