/*global define, PreloadJS, SoundJS TWEEN */

define(['graphicalweb/events/UserEvent'],

	function (AudioEvent) {
		
		var AudioController = function () {
			var instance = this,
            preload,
            assetsPath = "./audio/",
            manifest = [
                {id: "0001", src: assetsPath + "0001_yes.mp3|" + assetsPath + "0001_yes.ogg", type: "sound"},
                {id: "0002_sorryboss", src: assetsPath + "0002_sorryboss.mp3|" + assetsPath + "0002_sorryboss.ogg", type: "sound"},
                {id: "0003_letsgo", src: assetsPath + "0003_letsgo.mp3|" + assetsPath + "0003_letsgo.ogg", type: "sound"},
                {id: "0004_hubbahubba", src: assetsPath + "0004_hubbahubba.mp3|" + assetsPath + "0004_hubbahubba.ogg", type: "sound"}
                //{id: "hit", src: assetsPath + "Game-Break.mp3|" + assetsPath + "Game-Break.ogg", type: "sound"},
                //{id: "music", src: assetsPath + "18-machinae_supremacy-lord_krutors_dominion.mp3|" + assetsPath + "18-machinae_supremacy-lord_krutors_dominion.ogg", type: "sound"}
            ],
            DIALOGUE,
            BG_LOOP;

            instance.loaded = false;
            instance.fading = false;

//private

            function handle_FILE_LOAD() {
                _log('audio -file load');
            }

            function handle_LOAD_PROGRESS() {
                _log('audio -load progress');
            }

            function handle_LOAD_COMPLETE() {
                _log('audio -load complete');
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
                preload.onFileLoad = handle_FILE_LOAD;
                preload.onProgress = handle_LOAD_PROGRESS;
                preload.onComplete = handle_LOAD_COMPLETE;
                preload.loadManifest(manifest);
            };

            instance.playSFX = function (name) {
                SoundJS.play(name, SoundJS.INTERRUPT_NONE, 0, 0, 0, 1); 
            };

            instance.playDialogue = function (name, callback) {
                DIALOGUE = SoundJS.play(name, SoundJS.INTERRUPT_NONE, 0, 0, 0, 1); 
                DIALOGUE.onComplete = callback;
            };

            instance.playBgLoop = function (name) {
                BG_LOOP = SoundJS.play(name, SoundJS.INTERRUPT_NONE, 0, 0, -1, 1); 
            };

            instance.stopDialogue = function () {
                if (typeof(DIALOGUE) !== 'undefined') {
                    DIALOGUE.stop(); 
                }
            }

            instance.stopBgLoop = function () {
                BG_LOOP.stop();
            };
		
            instance.setBgLoop = function (name) {
                fadeOut(name);
            };
        };

		return new AudioController();
    });
