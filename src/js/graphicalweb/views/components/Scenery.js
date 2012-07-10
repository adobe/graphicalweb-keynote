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
                curvy = false,
                $container;

            instance.initted = false;
                
//private
            
          
//public
            instance.init = function () {
                Camera.show();

                instance.initted = true;
            };

            instance.addColor = function () {
                $('body').addClass('css');
            };

            instance.addCurves = function () {
                _log('addcurves');
                                
                if (curvy !== true) {
                    $('animate').each(function () {
                        $(this)[0].beginElement();
                        curvy = true;
                    });
                }
            };

            instance.removeColor = function () {
                $('body').removeClass('css');
            };

            instance.removeCurves = function () {
            
            };

		};

		return new Scenery();
    });
