/*global define $ Modernizr checkFeatureWithPropertyPrefix*/
define(['graphicalweb/events/StateEvent', 
        'graphicalweb/events/UserEvent', 
        'graphicalweb/utils/CSS3Helper', 
        'graphicalweb/models/AssetModel', 
        'graphicalweb/models/VarsModel', 
        'graphicalweb/controllers/AudioController', 
        'text!graphicalweb/views/html/intro.html'],

	function (StateEvent, 
        UserEvent, 
        CSS3Helper,
        AssetModel,
        VarsModel,
        Audio,
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
                $slide1,
                $title,
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
                var percent = Math.round(e.loaded * 100);
                if (percent == 100) {
                    $('#introLoader').hide();
                } else {
                    $('#introLoader').show();
                    percent += '%';
                }
                $('#introLoader').text(percent);
            }

            function handle_SCENERY_LOADED() {
                $view.one('click', handle_intro_CLICK);
                if (VarsModel.PRESENTATION !== true) {
                    $startCopy.fadeIn();
                }
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
            
            function runTests() {
                //browser
                if (VarsModel.ADOBE_BUILD === true) {
                    $('#testBrowser').hide();
                }

                //webgl
                if (Modernizr.webgl === true) {
                    $('#testWebgl').hide();
                }

                //3d
                if (Modernizr.csstransforms3d === true) {
                    $('#test3d').hide();
                }

                //BLEND
                if (document.body.style.webkitAlphaCompositing !== 'undefined') {
                    $('#testBlend').hide();
                }

                //SHADERS
                if (checkFeatureWithPropertyPrefix("filter", "custom(none url(http://www.example.com/))") !== false) {
                    $('#testShader').hide();
                }
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
                $title = $('.intro-title');

                $bg.html(intro_html);
                $slide1 = $('#slide1');
                $introClouds = $('#introCloudHolder');
                
                //if (VarsModel.PRESENTATION === true) {
                //    instance.phaselength = 1;
                //    instance.phase = 0;
                //    $slide1.show();
                //    runTests();
                //} else {
                //    setTimeout(function () {
                //        $('.intro-title').addClass('in');
                //    }, 1000);
                //}

                $title.show();
                setTimeout(function () {
                    $title.addClass('in');
                }, 1000);

                setup();
                update();

                StateEvent.INTRO_LOAD_PROGRESS.add(handle_INTRO_LOAD_PROGRESS);
                StateEvent.INTRO_LOADED.add(handle_INTRO_LOADED);
                AssetModel.loadIntro();

                StateEvent.SCENE_LOAD_PROGRESS.add(handle_SCENERY_LOAD_PROGRESS);
                StateEvent.SCENE_LOADED.add(handle_SCENERY_LOADED);
                //AssetModel.loadGroup(0, handle_init_COMPLETE);
            };

            instance.run = function () {

                switch (instance.phase) {
                case 1:
                    $slide1.addClass('out');
                    
                    setTimeout(function () {
                        $slide1.hide();
                        $('.intro-title').addClass('in');
                        if (VarsModel.MUSIC === true) {
                            Audio.playBgLoop('title_mus_amb');
                        } else {
                            Audio.playBgLoop('park_amb_loop');
                        }
                    }, 3000);
                    break;
                case 2:
                    break;
                }
            };

            instance.prev = function () {
                instance.phase -= 1;
                instance.run();
            };

            instance.next = function () {
                instance.phase += 1;
                instance.run();
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
