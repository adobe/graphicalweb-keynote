define([],

	function () {
		
		var Div = function () {
			var instance = this,
                element;

            instance.position = {x: 0, y: 0, z: 0};
            instance.rotation = {x: 0, y: 0, z: 0};

//private
            
            
//public
			instance.init = function () {
                element = $('#charDIV');
            };

		};

		return Div;
    });
