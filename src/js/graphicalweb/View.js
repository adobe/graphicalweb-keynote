define(['graphicalweb/views/IntroView'],

	function (IntroView) {
		
		var View = function () {
			var instance = this,
                $preloader;

//private
            
            
//public
			instance.init = function () {
                $preloader = $('#preloader');

                IntroView.init();
            };

            /**
             * show intro
             */
            instance.showIntro = function () {
                IntroView.start();
                $preloader.fadeOut();
            };

            /**
             * show start button
             */
            instance.showStartBtn = function () {
                $('#startCopy').fadeIn();
            };

            /**
             * begin experience sequence (core site)
             */
            instance.beginSequence = function () {
                _log('begin sequence');
            };

            instance.gotoSection = function () {

            };

            instance.init();
		};

		return View;
    });
