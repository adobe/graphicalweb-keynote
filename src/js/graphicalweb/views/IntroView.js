/*global define $*/
define(['graphicalweb/events/StateEvent', 
        'graphicalweb/events/UserEvent', 
        'graphicalweb/utils/CSS3Helper', 
        'graphicalweb/models/AssetModel', 
        'text!graphicalweb/views/html/intro.html'],

	function (StateEvent, 
        UserEvent, 
        CSS3Helper,
        AssetModel,
        intro_html) {
		
		var IntroView = function () {
			var instance = this,
                stateId = 0,
                $view,
                $bg,
                $cover,
                $preloader,
                $startCopy,
                $introClouds,
                intro_width = 500,
                area_width = 4000,
                WINDOW_WIDTH = window.innerWidth,
                WINDOW_HEIGHT = window.innerHeight,
                CLOUD_SPEED = 0.3,
                clouds = [],
                cloudElements,
                cloudX = 0,
                groupA,
                groupB,
                groupC,
                groupD,
                groupE,
                interval;

            instance.phase = 0;
            instance.phaselength = 0;

//private

            function handle_intro_CLICK(e) {
                UserEvent.NEXT.dispatch();
            }


            function handle_SCENERY_LOAD_PROGRESS(e) {
               _log('scenery progress:', e.loaded); 
            }

            function handle_SCENERY_LOADED() {
                $view.one('click', handle_intro_CLICK);
                $startCopy.fadeIn();
            }

            function handle_INTRO_LOAD_PROGRESS(e) {
                var percent = Math.round(e.loaded * 100);
                percent = percent == 100 ? '' : percent;
                $('#preloader .spinner').text(percent);
            }

            function handle_INTRO_LOADED() {
                StateEvent.SECTION_READY.dispatch(stateId);
                $view.fadeIn();
                instance.start();

                //hide preloader
                $preloader.hide();
            }

            function updateGroups(group) {
                var obj,
                    i = 0;

                for (i; i < group.list.length; i += 1) {
                    obj = group.list[i];
                    
                    obj.x = obj.x + obj.width > 0 ? obj.x - obj.speed : obj.x + obj.width + area_width;
                    CSS3Helper.setTransform(obj.element, 'translate3d(' + obj.x + 'px, ' + obj.y + 'px, 0px)');
                }

                group.delta = group.delta - group.speed;
                group.holder.style.backgroundPosition = group.delta + 'px 0px';
            }

            function updateClouds() {
                cloudX -= 0.5;
                $introClouds.css({'backgroundPosition': cloudX + 'px 0px'});
            }

            function update() {
                updateClouds();
                updateGroups(groupA);
                updateGroups(groupB);
                updateGroups(groupC);
                updateGroups(groupD);
            }

            function setupGroup(group) {
                var i = 0,
                    obj;

                for (i; i < group.elements.length; i += 1) {
                    obj = {
                        x: i * area_width / group.elements.length, 
                        y: 5, 
                        speed: group.speed,
                        element: group.elements[i],
                        width: 200
                    }

                    group.list.push(obj);
                }
            }

            /**
             * create objects for groups
             * setup groups
             */
            function setup() {
                //setupClouds();
                setupGroup(groupA);
                setupGroup(groupB);
                setupGroup(groupC);
                setupGroup(groupD);
                //setupGroup(groupE);
            }
            
//public
            instance.init = function () {
                $view = $('#introView');
                $bg = $('#introBg');
                $cover = $('#cover');
                $startCopy = $('#startCopy');
                $preloader = $('#preloader');

                $bg.html(intro_html);
                
                $introClouds = $('#introCloudHolder');

                //cloudElements = document.getElementsByClassName('intro-cloud');
                groupA = {
                    holder: document.getElementById('introGround1a'),
                    elements: document.getElementById('introGround1').getElementsByClassName('parallax')[0].getElementsByTagName('div'),
                    delta: 0,
                    speed: 0.5,
                    list: []
                };
                groupB = {
                    holder: document.getElementById('introGround2'),
                    elements: document.getElementById('introGround2').getElementsByTagName('div'),
                    delta: 0,
                    speed: 0.4,
                    list: []
                };
                groupC = {
                    holder: document.getElementById('introGround3'),
                    elements: document.getElementById('introGround3').getElementsByTagName('div'),
                    delta: 0,
                    speed: 0.3,
                    list: []
                };
                groupD = {
                    holder: document.getElementById('introGround4'),
                    elements: document.getElementById('introGround4').getElementsByTagName('div'),
                    delta: 0,
                    speed: 0.2,
                    list: []
                };
                
                setup();
                update();

                StateEvent.INTRO_LOAD_PROGRESS.add(handle_INTRO_LOAD_PROGRESS);
                StateEvent.INTRO_LOADED.add(handle_INTRO_LOADED);
                AssetModel.loadIntro();

                StateEvent.SCENE_LOAD_PROGRESS.add(handle_SCENERY_LOAD_PROGRESS);
                StateEvent.SCENE_LOADED.add(handle_SCENERY_LOADED);
                //AssetModel.loadGroup(0, handle_init_COMPLETE);
            };
            
            instance.animIn = function () {

            };

            instance.start = function () {
                interval = setInterval(update, 10);
            };

            instance.stop = function () {
                $cover.fadeIn(instance.destroy);  
            };

            instance.destroy = function () {
                $bg.empty();
                $view.hide();
                clearInterval(interval);
                StateEvent.SECTION_DESTROY.dispatch(stateId);

                //TODO:: ensure scenery is visible
            };
		};

		return new IntroView();
    });
