/*global define, PreloadJS, SoundJS TWEEN */

define(['graphicalweb/events/UserEvent'],

	function (AudioEvent) {
		
		var AudioController = function () {
			var instance = this,
            preload,
            assetsPath = "./audio/",
            dialogueList = [
                '0001_yes',
                '0002_sorryboss',
                '0003_letsgo',
                '0004_hubbahubba',
                '0005_1996',
                '0006_css',
                '0007_mademebetter',
                '0008_lookingforsvg',
                '0009_nevergetoutofsystem',
                '0010_interestingshape',
                '0011_everyshape',
                '0012_arrgh',
                '0013_vectorgraphics',
                '0014_svg',
                '0015_puff',
                '0016_watchvectorvictor',
                '0017_moredimension',
                '0018_threedimension',
                '0019_yow',
                '0020_mooned',
                '0021_zaxis',
                '0022_whatdoesitallmean',
                '0023_everyangle',
                '0024_seemyhouse',
                '0025_granular',
                '0026_pixels',
                '0027_freaky',
                '0028_2dcanvas',
                '0029_spielberg',
                '0030_further',
                '0031_suckingsound',
                '0032_weird',
                '0033_webgliam',
                '0034_realworld',
                '0035_notry',
                '0036_amidead',
                '0037_dontbeafraid',
                '0038_takethat',
                '0039_whataboutdistortion',
                '0040_princessanother',
                '0041_welcomediv',
                '0042_whatisthis',
                '0043_pervertex',
                '0044_exploregraphical',
                '0045_thisiswhatimtalkingabout',
                '0046_letsgetcreative'
            ],
            manifest = [],
            DIALOGUE,
            BG_LOOP,
            i = 0;

            instance.loaded = false;
            instance.fading = false;

            for (i = 0; i < dialogueList.length; i += 1) {
                manifest.push({id: dialogueList[i], src: assetsPath + 'dialogue/' + dialogueList[i] + ".mp3|" + assetsPath + 'dialogue/' + dialogueList[i] + ".ogg", type: "sound"});
            }

//private

            function handle_FILE_LOAD() {
                //_log('audio -file load');
            }

            function handle_LOAD_PROGRESS() {
                //_log('audio -load progress');
            }

            function handle_LOAD_COMPLETE() {
                //_log('audio -load complete');
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
