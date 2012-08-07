/*global define, PreloadJS, SoundJS TWEEN */

define(['graphicalweb/events/UserEvent'],

	function (AudioEvent) {
		
		var AudioController = function () {
			var instance = this,
            loopLoader,
            dialogueLaoder,
            currentLoop,
            nextLoop,
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
                '0012_arrrgh',
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
            loopList = [
                'theme_v1',     
                'space_v1'     
            ],
            dialogue = [],
            loops = [],
            DIALOGUE,
            BG_LOOP,
            BG_VOLUME = 0.1,
            DIALOGUE_VOLUME = 0.8,
            i = 0;

            instance.loaded = false;
            instance.fading = false;

            for (i = 0; i < dialogueList.length; i += 1) {
                dialogue.push({id: dialogueList[i], src: assetsPath + 'dialogue/' + dialogueList[i] + ".mp3|" + assetsPath + 'dialogue/' + dialogueList[i] + ".ogg", type: "sound"});
            }

            for (i = 0; i < loopList.length; i += 1) {
                loops.push({id: loopList[i], src: assetsPath + 'bg/' + loopList[i] + ".mp3|" + assetsPath + 'bg/' + loopList[i] + ".ogg", type: "sound"});
            }

            function handle_loopLoader_FILE_LOAD(e) {
                _log('loop loaded', e);
            }

            function handle_loopLoader_LOAD_PROGRESS(e) {
                _log('loop progress:', e.loaded);
            }

            function handle_loopLoader_LOAD_COMPLETE() {
                _log('loop loaded');
                loadDialogue();
            }

            function handle_dialogueLoader_FILE_LOAD(e) {
                _log('dialogue loaded', e);
            }

            function handle_dialogueLoader_LOAD_PROGRESS(e) {
                _log('dialogue progress:', e.loaded);
            }

            function handle_dialogueLoader_LOAD_COMPLETE() {
                _log('dialogue loaded');
            }

            function fadeIn() {
                var start = {x: 0},
                    end = {x: BG_VOLUME},
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
                var start = {x: BG_VOLUME},
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

            function loadDialogue() {
                dialogueLaoder = new PreloadJS();
                dialogueLaoder.installPlugin(SoundJS);
                dialogueLaoder.onFileLoad = handle_dialogueLoader_FILE_LOAD;
                dialogueLaoder.onProgress = handle_dialogueLoader_LOAD_PROGRESS;
                dialogueLaoder.onComplete = handle_dialogueLoader_LOAD_COMPLETE;
                dialogueLaoder.loadManifest(dialogue);
            }

            //TODO:: move loading into assetmodel??
            function loadLoops() {
                loopLoader = new PreloadJS();
                loopLoader.installPlugin(SoundJS);
                loopLoader.onFileLoad = handle_loopLoader_FILE_LOAD;
                loopLoader.onProgress = handle_loopLoader_LOAD_PROGRESS;
                loopLoader.onComplete = handle_loopLoader_LOAD_COMPLETE;
                loopLoader.loadManifest(loops);
            }
            
//public

			instance.init = function () {
                loadLoops(); 
            };

            instance.playSFX = function (name) {
                SoundJS.play(name, SoundJS.INTERRUPT_NONE, 0, 0, 0, 1); 
            };

            instance.playDialogue = function (name, callback) {
                if (typeof(DIALOGUE) !== 'undefined') {
                    DIALOGUE.stop();
                }
                DIALOGUE = SoundJS.play(name, SoundJS.INTERRUPT_NONE, 0, 0, 0, DIALOGUE_VOLUME); 
                DIALOGUE.onComplete = callback;
            };

            //TODO:: crossfade if defined
            instance.playBgLoop = function (name) {
                nextLoop = name;

                if (nextLoop !== currentLoop) {
                    if (typeof(BG_LOOP) !== 'undefined') {
                        //BG_LOOP.stop();
                        instance.setBgLoop(name);
                    } else {
                        BG_LOOP = SoundJS.play(name, SoundJS.INTERRUPT_NONE, 0, 0, -1, BG_VOLUME); 
                    }
                }

                currentLoop = name;
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
                currentLoop = name;
            };
        };

		return new AudioController();
    });
