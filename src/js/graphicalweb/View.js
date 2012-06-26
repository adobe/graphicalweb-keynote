define(['graphicalweb/views/IntroView'],

	function (IntroView) {
		
		var View = function () {
			var instance = this,
            $preloader,
            currentSection,
            sectionList = [

            ];

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
             * go to section
             * @param sec - int
             */
            instance.gotoSection = function (sec) {
                var nextSection = sec;

            };

            /**
             * next
             */
            instance.next = function () {
                var nextSection = currentSection + 1;
                instance.gotoSection(nextSection);
            };

            /**
             *  prev
             */
            instance.previous = function () {
                var nextSection = currentSection - 1;
                instance.gotoSection(nextSection);
            };

            instance.init();
		};

		return View;
    });
