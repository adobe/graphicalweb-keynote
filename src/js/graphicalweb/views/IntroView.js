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
                $startCopy,
                intro_width = 500,
                area_width = 4000,
                WINDOW_WIDTH = window.innerWidth,
                WINDOW_HEIGHT = window.innerHeight,
                CLOUD_SPEED = 0.3,
                clouds = [],
                cloudElements,
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

            function handle_scenery_COMPLETE() {
                $view.one('click', handle_intro_CLICK);
                $startCopy.fadeIn();
            }

            function handle_init_COMPLETE() {
                StateEvent.SECTION_READY.dispatch(stateId);
                $view.fadeIn();
                instance.start();

                AssetModel.loadGroup(1, handle_scenery_COMPLETE);
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
                var cloud,
                    i = 0;

                for (i; i < clouds.length; i += 1) {
                    cloud = clouds[i];
                    cloud.x = cloud.x + cloud.width > (-WINDOW_WIDTH / 2) ? cloud.x - cloud.speed : cloud.x + WINDOW_WIDTH + cloud.width;
                    CSS3Helper.setTransform(cloud.element, 'translate3d(' + cloud.x + 'px, ' + cloud.y + 'px, 0px)');
                }
            }

            function update() {
                updateClouds();
                updateGroups(groupA);
                updateGroups(groupB);
                updateGroups(groupC);
                updateGroups(groupD);
                updateGroups(groupE);
            }

            function setupClouds() {
                var cloud,
                    i = 0;

                for (i; i < cloudElements.length; i += 1) {
                    cloud = {
                        x: -WINDOW_WIDTH + i * WINDOW_WIDTH / cloudElements.length, 
                        y: -100 + Math.cos(i * 10) * 100, 
                        speed: 0.1 + Math.random() * CLOUD_SPEED,
                        element: cloudElements[i],
                        width: 210                    
                    };

                    clouds.push(cloud);
                }
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
                setupClouds();
                setupGroup(groupA);
                setupGroup(groupB);
                setupGroup(groupC);
                setupGroup(groupD);
                setupGroup(groupE);
            }
            
//public
            instance.init = function () {
                $view = $('#introView');
                $bg = $('#introBg');
                $cover = $('#cover');
                $startCopy = $('#startCopy');

                $bg.html(intro_html);

                cloudElements = document.getElementsByClassName('intro-cloud');
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
                groupE = {
                    holder: document.getElementById('introGround5'),
                    elements: document.getElementById('introGround5').getElementsByTagName('div'),
                    delta: 0,
                    speed: 0.1,
                    list: []
                }

                setup();
                update();

                AssetModel.loadGroup(0, handle_init_COMPLETE);
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
