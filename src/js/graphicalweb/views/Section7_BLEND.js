/*global define $ TWEEN d3*/
define(['graphicalweb/events/StateEvent',
        'graphicalweb/events/UserEvent',
        'graphicalweb/controllers/CameraController',
        'graphicalweb/controllers/AudioController',
        'graphicalweb/models/VarsModel',
        'graphicalweb/views/components/CharBlend',
        'graphicalweb/views/components/Div',
        'graphicalweb/views/components/Scenery'],

	function (StateEvent, UserEvent, Camera, Audio, VarsModel, Character, Div, Scenery) {
		
		var Section6_BLEND = function () {
			var instance = this,
                stateId = 7,
                ghost,
                c = 1,
                //mistHolder,
                //paths = [
                //    'M320,38c0,1-0.991,2-1.991,3c-6,3-12.995,3-18.995,2c-40-1-79.998,1-116.998,16c-57,23-125.999,30-177.999-11c-1-1-2-3-3-4c-1-2-2-4-1-6c2-4,6-3,9-3c29-1,57,1,87-4c10-2,19-4,29-7c26-9,50-19,78-23c18-2,34-1,52,2c20,4,37.991,10,54.991,22c4,3,7.991,6,9.991,11C320,37,320,37,320,38L320,38z',
                //    'M521,63c0,13-19.991,20-31.991,28c-6,5-12.995,8-18.995,11c-64,30-138.998,29-201.998-6c-28-15-51.999-33-82.999-43c-14-4-27-7-41-9c-19-2-37-2-56,0c-9,1-17,3-26,5c-3,0-6,1-9,1c-16,3-30.009,9-46.009,13C5.009,63,2,64,0,63c0-1,0-3,0-4c7-12,19.009-18,30.009-26c12-7,24.004-13,37.004-18c15-5,29.002-9,45.002-12c18-3,35.001-3,52.001-2c6,1,13,1,19,2c11,1,22,5,33,8c5,1,9,4,14,5c12,4,21,11,32,16c6,3,11,7,16,11c2,1,3,1,5,2c68,47,147.991,43,220.991,18c6-2,10.991-3,16.991-2C521,61,521,62,521,63L521,63z',
                //    'M304,43c0,1,0,1,0,2c-23,31-62.991,38-97.991,38c-6,0-12.996-2-18.996-2c-5-1-8.998-2-13.998-3c-20-6-37.999-16-56.999-24c-23-9-48-12-73-11c-13,1-27,3-40,2c-3-1-4-4-3-7c1-2,2-3,3-5c34-32,84-39,128-27c8,2,15,5,23,8c13,5,25,12,38,17c14,4,28,8,42,9c18,1,36,1,55-2c4-1,7.991,0,11.991,1c1,0,1.991,1,2.991,2C304,41,304,42,304,43L304,43z',
                //    'M319.018,26c-3,9-14,10-22,12c-44,12-88,12-132,14c-32,1-64,0-97-4c-14-2-27-4-41-7c-5-1-10-3-15-5c-3-2-8-3-10-6c-6-10,9-14,16-16c2,0,4-1,7-1c2,0,3-2,5-2c72-12,142-15,214-8c8,1,16,2,25,3c5,1,10,2,15,3c4,1,9,2,13,3C305.018,16,316.018,16,319.018,26L319.018,26z'
                //],
                //mistclouds = [
                //    {x: 400, y: 100, delta: 0, speed: 0.015, path: 0}, 
                //    {x: 700, y: 200, delta: 0, speed: 0.02, path: 3}, 
                //    {x: 600, y: 120, delta: 0, speed: 0.01, path: 1},
                //    {x: 900, y: 120, delta: 0, speed: 0.02, path: 3},
                //    {x: 1400, y: 150, delta: 0, speed: 0.015, path: 3},
                //    {x: 1100, y: 100, delta: 0, speed: 0.025, path: 2},
                //    {x: 1800, y: 100, delta: 0, speed: 0.015, path: 0},
                //    {x: 2000, y: 110, delta: 0, speed: 0.02, path: 0},
                //    {x: 2200, y: 100, delta: 0, speed: 0.01, path: 1}
                //],
                //MISTHOLDER_WIDTH = 3000,
                interval,
                delta = 0,
                $cover,
                $blockquotes,
                $mistHolder,
                view;

            instance.phaselength = 0;
            instance.phase = 0;

//private

            function handle_animIn_COMPLETE() {
                StateEvent.SECTION_ANIM_IN_COMPLETE.dispatch(stateId);
                ghost.fadeIn();
                $mistHolder.fadeIn();
                interval = setInterval(update, 10);

                if (VarsModel.PRESENTATION === true) {
                    instance.next();
                }
            }

            function update() {

                /*
                var i = 0,
                    nextpath,
                    tempY;

                delta += 1;

                for (i; i < mistclouds.length; i += 1) {
                    mistclouds[i].delta += mistclouds[i].speed;
                    mistclouds[i].x -= mistclouds[i].speed * 10;
                    
                    mistclouds[i].x = mistclouds[i].x < -400 ? mistclouds[i].x + MISTHOLDER_WIDTH : mistclouds[i].x;

                    tempY = mistclouds[i].y; //+ Math.sin(mistclouds[i].delta) * 20;
                    mistclouds[i].element.attr('transform', 'translate(' + mistclouds[i].x + ',' + tempY + ')');
                }
                */
            }
            
            instance.init = function () {
                var mist,
                    randompath,
                    i;

                view = '.section7';
                $blockquotes = $('blockquote' + view);
                $mistHolder = $('#mistHolder');
                
                instance.phase = 0;
                instance.phaselength = $blockquotes.length;
                
                ghost = new Character();

                /*
                mistHolder = d3.select("#mistHolder").append("svg");
                mistHolder.attr("width", MISTHOLDER_WIDTH).attr("height", 800);
                mistHolder.attr("class", "mist");

                for (i = 0; i < mistclouds.length; i += 1) {
                    mist = mistHolder.append('path');
                    randompath = mistclouds[i].path;
                    mist.attr('d', paths[randompath]);
                    mist.attr('transform', "translate(" + mistclouds[i].x + "," + mistclouds[i].y + ")");
                    mist.attr('fill', '#ffffff');
                    mist.attr('class', 'mist');
                    mistclouds[i].element = mist;
                }
                */

                StateEvent.SECTION_READY.dispatch(stateId);
            };

            instance.animIn = function (direct) {
                var goalPosition = {x: -650, y: -768, z: 0},
                    divPosition = {x: 800, y: 0, z: 0},
                    divRotation = {x: 0, y: 0, z: 0};

                if (direct) {
                    Camera.setPosition(goalPosition);
                    Scenery.setParallax(0, 1000);
                    Div.setPosition(divPosition);
                    Div.setRotation(divRotation);
                    handle_animIn_COMPLETE();
                } else {
                    Camera.reset(2000);
                    Camera.animatePosition(goalPosition, 1000);
                    Scenery.animateParallax(0, 1000);
                    Div.animatePosition(divPosition, 1000, {callback: handle_animIn_COMPLETE});
                    Div.animateRotation(divRotation, 1000); 
                }
            };

           
            instance.next = function () {
                var $currentQuote = $($blockquotes[instance.phase]);
                
                $blockquotes.fadeOut();
                
                switch (instance.phase) {
                case 0:
                    //amidead
                    StateEvent.AUTOMATING.dispatch();         
                    Div.setFace('talk');                   
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        Div.setFace('happy');
                        UserEvent.NEXT.dispatch();                        
                    });
                    break;
                case 1:
                    //dont be afraid
                    Div.setFace('happy');
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        UserEvent.NEXT.dispatch();
                    });
                    break;
                case 2:
                    //take that
                    Div.setFace('happy');
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        StateEvent.WAIT_FOR_INTERACTION.dispatch();
                    });
                    break;
                case 3:
                    //distortion?
                    StateEvent.AUTOMATING.dispatch();         
                    Div.setFace('talk');
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        Div.setFace('happy');
                        UserEvent.NEXT.dispatch();
                    });
                    break;
                case 4:
                    //princess another castle
                    Div.setFace('happy');
                    Audio.playDialogue($currentQuote.data('audio'), function () {
                        UserEvent.NEXT.dispatch();
                    });
                    break;
                }
                
                instance.phase += 1;
            };

            instance.stop = function () {
                $mistHolder.fadeOut(200, function () {
                    instance.destroy();
                });
                ghost.fadeOut();
            };

            instance.destroy = function () {
                clearInterval(interval);
                /*
                var i = 0;
                for (i; i < mistclouds.length; i += 1) {
                    mistclouds[i].element.remove();   
                }
                mistHolder.remove();
                */
                StateEvent.SECTION_DESTROY.dispatch();
            };
		};

		return new Section6_BLEND();
    });
