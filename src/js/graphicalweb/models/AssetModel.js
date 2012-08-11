/*global define PreloadJS SoundJS $*/
define(['graphicalweb/events/StateEvent'],

	function (StateEvent) {
        
		var AssetModel = function () {
			var instance = this,
                IMG_DIR = '../assets/img/',
                AUDIO_DIR = '../assets/audio/',
                INTRO_LOADER,
                SCENE_LOADER;

            instance.INTRO_IMAGES = [
                'intro/ground-shading.svg',
                'intro/cloud-1.svg',
                'intro/cloud-2.svg',
                'intro/bush-1.svg',
                'intro/grass.svg',
                'intro/tree-1.svg',
                'intro/tree-2.svg',
                'intro/tree-3.svg',
                'intro/tree-4.svg',
                'intro/tree-5.svg',
                'intro/tree-6.svg',
                'intro/tree-7.svg'
            ];

            instance.CHARACTER_IMAGES = [
                'character/div.jpg',
                'character/css.png',
                'character/char3d/bg.png',
                'character/char3d/face.png',
                'svg/ghost.svg'
            ];

            instance.UI_IMAGES = [
                'svg/info_icon.svg',
                'svg/icon_right.svg',
                'svg/circle.svg',
                'svg/circle_large.svg',
                'button/css.png',
                'button/svg.png',
                'button/transforms.png',
                'button/canvas.png',
                'button/webglBG.png',
                'button/webgl.png',
                'button/blend.png',
                'button/shader.png'
            ];

            instance.AUDIO_DIALOGUE = [];
            $('blockquote').each(function () {
                var $this = $(this);
                instance.AUDIO_DIALOGUE.push($this.data('audio'));
            });

            instance.AUDIO_BG = [
                'theme_v1',     
                'space_v1'     
            ];

//private

            
//public

            instance.loadIntro = function () {
                _log('load intro');
                var i,
                    name,
                    list = [],
                    INTRO_AUDIO;

                for (i = 0; i < instance.INTRO_IMAGES.length; i += 1) {
                    name = instance.INTRO_IMAGES[i];
                    list.push({id: name, src: IMG_DIR + name, type: "image"});
                }

                list.push({id: instance.AUDIO_BG[0], src: AUDIO_DIR + 'bg/' + instance.AUDIO_BG[0] + ".mp3|" + AUDIO_DIR + 'bg/' + instance.AUDIO_BG[0] + ".ogg", type: "sound"});
                
                INTRO_LOADER = new PreloadJS();
                INTRO_LOADER.installPlugin(SoundJS);
                INTRO_LOADER.onFileLoad = function (e) {
                    //_log('intro load:', e.id);
                };
                INTRO_LOADER.onProgress = function (e) {
                    
                };
                INTRO_LOADER.onComplete = function (e) {
                    StateEvent.INTRO_LOADED.dispatch();
                    instance.loadScene();
                };
                INTRO_LOADER.loadManifest(list);
            }

            //TODO:: group by scene instead of bulk
            instance.loadScene = function () {
                var i,
                    name,
                    list = [];
                
                for (i = 0; i < instance.CHARACTER_IMAGES.length; i += 1) {
                    name = instance.CHARACTER_IMAGES[i];
                    list.push({id: name, src: IMG_DIR + name, type: "image"});
                }

                for (i = 0; i < instance.AUDIO_BG.length; i += 1) {
                    name = instance.AUDIO_BG[i];
                    list.push({id: name, src: AUDIO_DIR + 'bg/' + name + ".mp3|" + AUDIO_DIR + 'bg/' + name + ".ogg", type: "sound"});
                }

                for (i = 0; i < instance.AUDIO_DIALOGUE.length; i += 1) {
                    name = instance.AUDIO_DIALOGUE[i];
                    list.push({id: name, src: AUDIO_DIR + 'dialogue/' + name + ".mp3|" + AUDIO_DIR + 'dialogue/' + name + ".ogg", type: "sound"});
                }

                SCENE_LOADER = new PreloadJS();
                SCENE_LOADER.installPlugin(SoundJS);
                SCENE_LOADER.onFileLoad = function (e) {
                    _log('sFILE:', e.id);
                };
                SCENE_LOADER.onProgress = function (e) {
                    _log('sPROGRESS:', e.loaded);
                };
                SCENE_LOADER.onComplete = function (e) {
                    StateEvent.SCENE_LOADED.dispatch();
                };
                SCENE_LOADER.loadManifest(list);
            }
        };

		return new AssetModel();
    });
