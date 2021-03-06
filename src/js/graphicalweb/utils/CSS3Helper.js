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
                if (typeof(obj) !== 'undefined') {
                    obj.style.webkitTransform = transformValue;
                    obj.style.MozTransform = transformValue;
                    obj.style.Transform = transformValue;
                }
            }

            /**
             * set transform origin
             * @param obj - DOM element
             * @param transformValue - string
             */
			instance.setTransformOrigin = function (obj, transformValue) {
                if (typeof(obj) !== 'undefined') {
                    obj.style.webkitTransformOrigin = transformValue;
                    obj.style.MozTransformOrigin = transformValue;
                    obj.style.TransformOrigin = transformValue;
                }
            }

            /**
             * set perspective origin
             * @param obj - DOM element
             * @param transformValue - string
             */
			instance.setPerspectiveOrigin = function (obj, transformValue) {
                if (typeof(obj) !== 'undefined') {
                    obj.style.webkitPerspectiveOrigin = transformValue;
                    obj.style.MozPerspectiveOrigin = transformValue;
                    obj.style.PerspectiveOrigin = transformValue;
                }
            }

            /**
             * set perspective origin
             * @param obj - DOM element
             * @param transformValue - string
             */
			instance.setPerspective = function (obj, transformValue) {
                if (typeof(obj) !== 'undefined') {
                    obj.style.webkitPerspective = transformValue;
                    obj.style.MozPerspective = transformValue + 'px';
                    obj.style.perspective = transformValue;
                }
            }

            /**
             * set perspective origin
             * @param obj - DOM element
             * @param transformValue - string
             */
			instance.getPerspective = function (obj) {
                if (typeof(obj) !== 'undefined') {
                    if (typeof(obj.style.wekitPerspective) !== 'undefined') {
                        return parseInt(obj.style.webkitPerspective);
                    } else if (typeof(obj.style.MozPerspective) !== 'undefined') {
                        return parseInt(obj.style.MozPerspective);
                    } else if (typeof(obj.style.perspective) !== 'undefined') {
                        return parseInt(obj.style.perspective);
                    }
                }
            }

		};

		return new CSS3Helper();
    });
