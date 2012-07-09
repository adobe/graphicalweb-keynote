define(['graphicalweb/Model', 'graphicalweb/View', 'graphicalweb/Controller'],

	function (Model, View, Controller) {
		
		var App = function () {
			var instance = this,
				view,
				model,
				controller;

//private
            
            
//public
            instance.init = function () {
                _log('init');
                model = new Model();
                view = new View();
                controller = new Controller(view, model);
            };
		};

		return new App();
    });
