/*global define, PreloadJS, SoundJS TWEEN */

define(['graphicalweb/events/UserEvent'],

	function (AudioEvent) {
		
		var AudioController = function () {
			var instance = this,
            preload,
            assetsPath = "./audio/",
            manifest = [
                {id: "hit", src: assetsPath + "Game-Break.mp3|" + assetsPath + "Game-Break.ogg", type: "sound"},
                {id: "music", src: assetsPath + "18-machinae_supremacy-lord_krutors_dominion.mp3|" + assetsPath + "18-machinae_supremacy-lord_krutors_dominion.ogg", type: "sound"}
            ],
            DIALOGUE,
            BG_LOOP;

            instance.loaded = false;
            instance.fading = false;

//private
            function handle_LOAD_COMPLETE() {
                /*
                instance.playSFX('hit');
                instance.playBgLoop('music');

                setTimeout(function () {
                    instance.setBgLoop('music');
                }, 1000);
                */
                instance.loaded = true;
            }

            function fadeIn() {
                var start = {x: 0},
                    end = {x: 1},
                    duration = 1000;

                new TWEEN.Tween(start)
                    .to(end, duration)
                    .onUpdate(function () {
                        BG_LOOP.setVolume(start.x);
                    })
                    .onComplete(function () {
                        instance.fading = false;
                    })
                    .start();
            }

            function fadeOut(name) {
                var start = {x: 1},
                    end = {x: 0},
                    duration = 1000;

                instance.fading = true;

                new TWEEN.Tween(start)
                    .to(end, duration)
                    .onUpdate(function () {
                        BG_LOOP.setVolume(start.x);
                    })
                    .onComplete(function () {
                        BG_LOOP.stop();
                        BG_LOOP = SoundJS.play(name, SoundJS.INTERRUPT_NONE, 0, 0, -1, 0); 
                        fadeIn();
                    })
                    .start();
            }
            
//public

			instance.init = function () {
                preload = new PreloadJS();
                preload.installPlugin(SoundJS);
                //preload.onFileLoad = handleFileLoad;
                //preload.onProgress = handleProgress;
                preload.onComplete = handle_LOAD_COMPLETE;
                preload.loadManifest(manifest);
            };

            instance.playSFX = function (name) {
                SoundJS.play(name, SoundJS.INTERRUPT_NONE, 0, 0, 0, 1); 
            };

            instance.playDialogue = function (name) {
                DIALOGUE = SoundJS.play(name, SoundJS.INTERRUPT_NONE, 0, 0, 0, 1); 
            };

            instance.playBgLoop = function (name) {
                BG_LOOP = SoundJS.play(name, SoundJS.INTERRUPT_NONE, 0, 0, -1, 1); 
            };

            instance.stopBgLoop = function () {
                BG_LOOP.stop();
            };
		
            instance.setBgLoop = function (name) {
                fadeOut(name);
            };
        };

		return new AudioController();
    });
