define(['text!graphicalweb/views/html/scenery.html',
        'graphicalweb/controllers/CameraController',
        'graphicalweb/utils/CSS3Helper'],

	function (scenery_html, Camera, CSS3Helper) {
		
		var Scenery = function () {
			var instance = this,
                $camera,
                $container,
                $scene,
                transformOriginString,
                rotateString,
                translateString;

//private
                        
            function update() {

                translateString = 'translate3d(' + Camera.position.x + 'px, ' + Camera.position.y + 'px, ' + Camera.position.z + 'px)';
                rotateString = 'rotateX(' + Camera.rotation.x + 'deg) rotateY(' + Camera.rotation.y + 'deg) rotateZ(' + Camera.rotation.z + 'deg)';
                CSS3Helper.setTransform($scene[0], translateString + rotateString);

                //transformOriginString = (-Camera.position.x + $(window).width() / 2) + 'px ' + -Camera.position.y + 'px ' + -Camera.position.z + 'px';
                //CSS3Helper.setTransformOrigin($scene[0], transformOriginString);
            }

//public
            instance.init = function () {
                _log('scene init');
                
                $container = $('#background');
                $camera = $('#camera');
                $scene = $('#scene');

                $container.html(scenery_html);
                $camera.show();

                //TODO:: start and stop this when moving camera?
                setInterval(update, 10);
            };
		};

		return new Scenery();
    });
