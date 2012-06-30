define([],

	function () {
		
		var Model = function () {
			var instance = this,
            title,
            states = [
                {state: 0, title: 'Intro', url: ''},
                {state: 1, title: 'Div', url: 'div'}, 
                {state: 2, title: 'CSS', url: 'css'}
            ];

//private
            
            
//public
			instance.init = function () {
                title = $('title').text();
            };

            instance.init();
		};

		return Model;
    });
