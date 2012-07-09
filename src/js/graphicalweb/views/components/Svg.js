define(['text!graphicalweb/views/svg/charSVG.svg'],

	function (svg) {
		
		var CharSVG = function () {
			var instance = this,
                container;

//private
            
            
//public
			instance.init = function () {
                container = $('#charSVG');
                container.html(svg);
            };

            instance.init();
		};

		return CharSVG;
    });
