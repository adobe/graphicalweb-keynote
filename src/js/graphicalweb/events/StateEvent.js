/*global define signals*/
define([],

	function () {
		
		var StateEvent = {
            INTRO_LOADED: new signals.Signal(),
            SCENE_LOADED: new signals.Signal(),
            //PRELOAD_COMPLETE: new signals.Signal(),
            //LOAD_COMPLETE: new signals.Signal(),
            INTRO_END: new signals.Signal(),
            STATE_CHANGE: new signals.Signal(),
            SECTION_READY: new signals.Signal(),
            SECTION_ANIM_IN_COMPLETE: new signals.Signal(),
            SECTION_DESTROY: new signals.Signal(),
            AUTOMATING: new signals.Signal(),
            WAIT_FOR_INTERACTION: new signals.Signal()
        };

		return StateEvent;
    });
