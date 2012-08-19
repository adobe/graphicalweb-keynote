/*global define, PreloadJS, SoundJS TWEEN */

define(['graphicalweb/events/UserEvent', 'graphicalweb/models/VarsModel'],

	function (AudioEvent, VarsModel) {
		
		var AudioController = function () {
			var instance = this,
            currentLoop,
            nextLoop,
            dialogue = [],
            loops = [],
            DIALOGUE,
            BG_LOOP,
            BG_VOLUME = 0.05,
            DIALOGUE_VOLUME = 0.8,
            i = 0;

            instance.sound = true;
            instance.fading = false;

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

//public

			instance.init = function () {

            };

            //TODO:: stop and prevent playing of sounds
            instance.off = function () {
                instance.sound = false;
                SoundJS.stop();
            };

            //TODO:: resume playing of sounds for current bg loop
            instance.on = function () {
                instance.sound = true;
                SoundJS.resume();
            };

            instance.playSFX = function (name) {
                if (VarsModel.AUDIO === true) {
                    SoundJS.play(name, SoundJS.INTERRUPT_NONE, 0, 0, 0, 1); 
                }
            };

            instance.playDialogue = function (name, callback) {
                if (VarsModel.AUDIO === true) {
                    if (typeof(DIALOGUE) !== 'undefined') {
                        DIALOGUE.stop();
                    }
                    DIALOGUE = SoundJS.play(name, SoundJS.INTERRUPT_NONE, 0, 0, 0, DIALOGUE_VOLUME); 
                    DIALOGUE.onComplete = callback;
                }
            };

            //TODO:: crossfade if defined
            instance.playBgLoop = function (name) {
                if (VarsModel.AUDIO === true) {
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
                }
            };

            instance.stopDialogue = function () {
                if (VarsModel.AUDIO === true) {
                    if (typeof(DIALOGUE) !== 'undefined') {
                        DIALOGUE.stop(); 
                    }
                }
            }

            instance.stopBgLoop = function () {
                if (VarsModel.AUDIO === true) {
                    BG_LOOP.stop();
                }
            };
		
            instance.setBgLoop = function (name) {
                if (VarsModel.AUDIO === true) {
                    fadeOut(name);
                    currentLoop = name;
                }
            };
        };

		return new AudioController();
    });
