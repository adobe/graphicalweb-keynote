/*global define PreloadJS SoundJS $*/
define(['graphicalweb/events/StateEvent', 'graphicalweb/models/VarsModel'],

	function (StateEvent, VarsModel) {
        
		var AssetModel = function () {
			var instance = this,
                IMG_DIR = '../assets/img/',
                AUDIO_DIR = '../assets/audio/',
                INTRO_LOADER,
                SCENE_LOADER;

            instance.INTRO_IMAGES = [
                'intro/ground-shading.svg',
                'intro/tree-1.svg',
                'intro/tree-2.svg',
                'intro/tree-3.svg',
                'intro/tree-4.svg',
                'intro/tree-5.svg',
                'intro/tree-6.svg',
                'intro/tree-7.svg'
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
                'title_mus_amb',     
                'main_mus_amb',     
                'royal_mus_amb_1',     
                'space_mus_amb',     
                'space_form_loop',     
                'spooky_mus_amb',     
                'parade_mus_amb'     
            ];

            instance.AUDIO_SFX = [
                'button_click',     
                'button_hover',
                'green_sponge',
                'mountains',
                'space_face',
                'space_trans',
                'text_popup',
                'text_typing'
            ];

//private

            
//public

            instance.loadIntro = function () {
                var i,
                    name,
                    list = [],
                    INTRO_AUDIO;

                for (i = 0; i < instance.INTRO_IMAGES.length; i += 1) {
                    name = instance.INTRO_IMAGES[i];
                    list.push({id: name, src: IMG_DIR + name, type: "image"});
                }

                if (VarsModel.AUDIO === true) {
                    list.push({id: instance.AUDIO_BG[0], src: AUDIO_DIR + 'bg/' + instance.AUDIO_BG[0] + ".mp3|" + AUDIO_DIR + 'bg/' + instance.AUDIO_BG[0] + ".ogg", type: "sound"});
                }

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
                
                if (VarsModel.AUDIO === true) {
                    
                    if (VarsModel.PRESENTATION === true) {
                        for (i = 0; i < instance.AUDIO_DIALOGUE.length; i += 1) {
                            name = instance.AUDIO_DIALOGUE[i];
                            list.push({id: name, src: AUDIO_DIR + 'dialogue/' + name + ".mp3|" + AUDIO_DIR + 'dialogue/' + name + ".ogg", type: "sound"});
                        }
                    }

                    for (i = 0; i < instance.AUDIO_BG.length; i += 1) {
                        name = instance.AUDIO_BG[i];
                        list.push({id: name, src: AUDIO_DIR + 'bg/' + name + ".mp3|" + AUDIO_DIR + 'bg/' + name + ".ogg", type: "sound"});
                    }

                    for (i = 0; i < instance.AUDIO_SFX.length; i += 1) {
                        name = instance.AUDIO_SFX[i];
                        list.push({id: name, src: AUDIO_DIR + 'sfx/' + name + ".mp3|" + AUDIO_DIR + 'sfx/' + name + ".ogg", type: "sound"});
                    }
                }

                SCENE_LOADER = new PreloadJS();
                SCENE_LOADER.installPlugin(SoundJS);
                SCENE_LOADER.onFileLoad = function (e) {
                    //_log('sFILE:', e.id);
                };
                SCENE_LOADER.onProgress = function (e) {
                    //_log('sPROGRESS:', e.loaded);
                };
                SCENE_LOADER.onComplete = function (e) {
                    StateEvent.SCENE_LOADED.dispatch();
                };
                SCENE_LOADER.loadManifest(list);
            }
        };

		return new AssetModel();
    });
