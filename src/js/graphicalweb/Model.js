define([],

	function () {
		
		var Model = function () {
			var instance = this;

//private
            
            
//public
			instance.init = function () {
           	    console.log('model init');
            };

            instance.init();
		};

		return Model;
    });
