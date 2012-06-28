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

            /**
             * set transform origin
             * @param obj - DOM element
             * @param transformValue - string
             */
			instance.setTransformOrigin = function (obj, transformValue) {
                obj.style.webkitTransformOrigin = transformValue;
                obj.style.MozTransformOrigin = transformValue;
                obj.style.TransformOrigin = transformValue;
            }

            /**
             * set perspective origin
             * @param obj - DOM element
             * @param transformValue - string
             */
			instance.setPerspectiveOrigin = function (obj, transformValue) {
                obj.style.webkitPerspectiveOrigin = transformValue;
                obj.style.MozPerspectiveOrigin = transformValue;
                obj.style.PerspectiveOrigin = transformValue;
            }

            /**
             * set perspective origin
             * @param obj - DOM element
             * @param transformValue - string
             */
			instance.setPerspective = function (obj, transformValue) {
                obj.style.webkitPerspective = transformValue;
                obj.style.MozPerspective = transformValue;
                obj.style.Perspective = transformValue;
            }


		};

		return new CSS3Helper();
    });
