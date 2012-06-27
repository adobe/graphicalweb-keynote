define(['graphicalweb/controllers/CameraController', 
        'graphicalweb/views/IntroView',
        'graphicalweb/events/StateEvent',
        'graphicalweb/views/components/Scenery',
        'graphicalweb/views/Section1_DIV'],

	function (Camera, IntroView, StateEvent, Scenery, Section1_DIV) {
		
		var View = function () {
			var instance = this,
                $preloader,
                $cover,
                currentSection,
                sectionList = [
                    null,
                    Section1_DIV
                ];

//private
            
            function handle_SECTION_READY(section) {
                _log('SECTION READY' + section);

                sectionList[currentSection].start();

                if ($cover.css('display') == 'block') {
                    Scenery.init();
                    $cover.fadeOut();
                }
            }

//public
			instance.init = function () {
                $preloader = $('#preloader');
                $cover = $('#cover');

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
             * @param section - int
             */
            instance.gotoSection = function (section) {
                var nextSection = section;

                currentSection = nextSection;
                StateEvent.SECTION_READY.add(handle_SECTION_READY);
                
                sectionList[nextSection].init();
            };

            /**
             * next section
             */
            instance.next = function () {
                var nextSection = currentSection + 1;
                instance.gotoSection(nextSection);
            };

            /**
             *  prev section
             */
            instance.previous = function () {
                var nextSection = currentSection - 1;
                instance.gotoSection(nextSection);
            };

            instance.init();
		};

		return View;
    });
