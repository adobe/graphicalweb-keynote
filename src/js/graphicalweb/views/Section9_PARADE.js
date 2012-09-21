/*global define $ TWEEN*/

define(['graphicalweb/events/StateEvent',
        'graphicalweb/events/UserEvent',
        'graphicalweb/controllers/CameraController',
        'graphicalweb/controllers/AudioController',
        'graphicalweb/models/VarsModel',
        'graphicalweb/views/components/CharShader',
        'graphicalweb/views/components/CharCss',
        'graphicalweb/views/components/CharSvg',
        'graphicalweb/views/components/char3d',
        'graphicalweb/views/components/CharBlend',
        'graphicalweb/views/components/TinyCanvas',
        'graphicalweb/views/components/TinyWebgl',
        'graphicalweb/views/components/Div',
        'graphicalweb/views/components/Scenery'],

	function (StateEvent, UserEvent, Camera, Audio, VarsModel, Shader, CSS, SVG, Moon, Blend, TinyCanvas, TinyWebgl, Div, Scenery) {
		
		var Section9_PARADE = function () {
			var instance = this,
                stateId = 9,
                shader,
                moon,
                css,
                blend,
                svg,
                webgl,
                canvas,
                credit_interval,
                $blockquotes,
                $parade,
                $carouselHolder,
                $carouselContent,
                $paradeBtnHolder,
                $creditItem,
                credit_state = 0,
                view;

            instance.phaselength = 0;
            instance.phase = 0;

//private

            /**
             * hide carousel
             */
            function hideCarousel() {
                $carouselContent.removeClass('in');
                if (VarsModel.ADOBE_BUILD !== true) {
                    $creditItem.hide();
                    $carouselHolder.hide();
                    $carouselContent.hide();
                } else {
                    setTimeout(function () {
                        $creditItem.hide();
                        $carouselHolder.hide();
                        $carouselContent.hide();
                    }, 400);
                }
            }

            /**
             * credit interval update
             */
            function handle_credit_UPDATE() {
                var newCredit = $($creditItem[credit_state]);
                $creditItem.show();
                $creditItem.css({'webkitAnimation': 'none'});
                newCredit.css({'webkitAnimation': 'creditAnimation 3s infinite ease-in-out'});
                credit_state += 1;
                if (credit_state > $creditItem.length) {
                    clearInterval(credit_interval);
                    UserEvent.NEXT.dispatch();
                }
                //credit_state = credit_state < $creditItem.length - 1 ? credit_state + 1 : 0;
            }

            /* 
             * transition from one to another 
             */
            function setCarousel(num) {

                //var $hitArea = $('#carouselHitArea');

                function fadeIn() {
                    $($carouselContent[num]).addClass('in');
                }

                function swap() {
                    $carouselContent.hide();
                    $($carouselContent[num]).show();
                    setTimeout(fadeIn, 10);
                }

                if (num == 8) {
                    //$hitArea.hide();
                    credit_interval = setInterval(handle_credit_UPDATE, 3000);
                    credit_state = 0;
                } else if (num == 9) {
                    //$hitArea.hide();
                    clearInterval(credit_interval);
                    $creditItem.hide();
                } else {
                    //$hitArea.show();
                    clearInterval(credit_interval);
                    $creditItem.hide();
                }
                
                $carouselHolder.show();
                
                if (VarsModel.ADOBE_BUILD !== false) {
                    $carouselContent.removeClass('in');
                    setTimeout(swap, 400);
                } else {
                    $carouselContent.hide();
                    $($carouselContent[num]).show();
                }
            }

            /**
             * click event for buttons to show carousel
             */
            function handle_paradeBtn_CLICK(e) {
                var carousel = $(this).data('carousel');
                setCarousel(carousel);
            }


            function handle_animIn_COMPLETE() {
                StateEvent.SECTION_ANIM_IN_COMPLETE.dispatch(stateId);
                
                shader.start();
                svg.start();
                css.start();
                moon.start();
                blend.start();
                canvas.start();
                canvas.show();

                svg.moveTo({x: 0, y: -300}, 1000);
                css.moveTo({x: 120, y: 180}, 1000);
                moon.moveTo({x: -400, y: -150}, 1000);
                blend.fadeIn({'left': '0px', 'opacity': '1'});

                function setupParadeButtons() {
                    $paradeBtnHolder.show();
                    $('.parade-about-btn').bind('click', handle_paradeBtn_CLICK);
                    $('#carouselHitArea').bind('click', hideCarousel);
                }

                if (VarsModel.PRESENTATION === true) {
                    instance.next();
                } else {
                    $(view + ':not(blockquote)').show();
                    setTimeout(setupParadeButtons, 1000);
                }
            }
            
//public
            instance.init = function (direct) {
                view = '.section9';
                $blockquotes = $('blockquote' + view);

                $carouselContent = $('.carousel-content');
                $carouselHolder = $('#carouselHolder');
                $parade = $('#charParade');
                $paradeBtnHolder = $('#paradeAboutBtns');
                $creditItem = $('.credit-item');
                
                $parade.show();

                if (VarsModel.ADOBE_BUILD !== true) {
                    $('#warning').fadeIn();
                }

                //webgl = new TinyWebgl();
                canvas = new TinyCanvas();
                css = new CSS('#paradeCSS');
                svg = new SVG('#paradeSVG');
                moon = new Moon('#paradeTransform');
                blend = new Blend('#paradeBlend');
                shader = new Shader();

                credit_state = 0;
                instance.phase = 0;
                instance.phaselength = $blockquotes.length + $carouselContent.length; //pad for other sections

                StateEvent.SECTION_READY.dispatch(stateId);
            };

            instance.update = function () {
                if (VarsModel.DETAILS === true) {
                    svg.update();
                    moon.update();
                }
            };

            instance.animIn = function (direct) {
                var goalPosition = {x: -2550, y: -768, z: 0},
                    goalRotation = {x: 0, y: 0, z: 0},
                    divPosition = {x: 2500, y: 0, z: 0},
                    divRotation = {x: 0, y: 0, z: 0};

                if (direct) {
                    Camera.setPosition(goalPosition);
                    Scenery.setParallax(300);
                    Div.setPosition(divPosition);
                    Div.setRotation(divRotation);
                    handle_animIn_COMPLETE();
                } else {
                    Camera.animatePosition(goalPosition, 1000);
                    Scenery.animateParallax(300, 1000);
                    Div.animateRotation(divRotation, 2000);                    
                    Div.animatePosition(divPosition, 2000, {easing: TWEEN.Easing.Sinusoidal.EaseIn, callback: handle_animIn_COMPLETE});
                }
            };

            instance.run = function () {
                var $currentQuote = $($blockquotes[instance.phase - 1]),
                    carousel;
                
                $blockquotes.fadeOut();

                switch (instance.phase) {
                case 1:
                    //explore graphical web
                    hideCarousel();
                    StateEvent.AUTOMATING.dispatch();         
                    Div.setFace('happy');
                    shader.talk(true);
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        UserEvent.NEXT.dispatch();
                        shader.talk(false);
                    });
                    break;
                case 2:
                    //this is what i'm talking about
                    hideCarousel();
                    Div.setFace('talk');
                    shader.talk(false);
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        UserEvent.NEXT.dispatch();
                    });
                    break;
                case 3:
                    //let's get creative
                    hideCarousel();
                    Div.setFace('talk');
                    shader.talk(false);
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        Div.setFace('happy');
                        shader.talk(false);
                    });
                    break;
                default:
                    Div.setFace('happy');
                    shader.talk(false);
                    carousel = instance.phase - 4;
                    setCarousel(carousel);
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

            instance.stop = function () {
                Audio.stopDialogue();

                clearInterval(credit_interval);
                
                $(view).hide();
                $paradeBtnHolder.hide();
                $creditItem.hide();
                
                hideCarousel();

                Div.setFace('happy');
                shader.talk(false);

                shader.stop();
                css.stop();
                svg.stop();
                moon.stop();
                canvas.stop();
                canvas.hide();
     
                svg.moveTo({x: 900, y: -300}, 300);
                css.moveTo({x: 1000, y: 200}, 300);
                moon.moveTo({x: -400, y: -800}, 300);
                blend.fadeOut(function () {
                    blend.stop();
                    instance.destroy();
                });
            };

            instance.destroy = function () {
                $parade.hide();
                StateEvent.SECTION_DESTROY.dispatch();
            };
		};

		return new Section9_PARADE();
    });
