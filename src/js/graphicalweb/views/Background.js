define([],

	function () {
		
		var Background = function () {
			var instance = this,
                container;

//private
            
            
//public
			instance.init = function () {
           	    console.log('background init');

                container = $('#background');
            };
		};

		return Background;
    });
