define([],

	function () {
		
		var CSS3Helper = function () {
			var instance = this;

//private
 
            
//public

            /**
             * set transform
             * @param obj - DOM element
             * @param transformValue - string
             */
			instance.setTransform = function (obj, transformValue) {
                obj.style.webkitTransform = transformValue;
                obj.style.MozTransform = transformValue;
                obj.style.Transform = transformValue;
            }

		};

		return new CSS3Helper();
    });
