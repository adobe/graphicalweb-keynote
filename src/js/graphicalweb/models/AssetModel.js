define([],

	function () {
		
		var AssetModel = function () {
			var instance = this;

            instance.imageList = [
                {src: 'img/'},
                {src: 'img/'}
            ];

//private
            
            function handle_img_LOADED(e) {
                
            }
            
//public

			instance.loadImages = function () {
                var i,
                    img,
                    imageArray = instance.imageList;

                for (i; i < imageArray.length; i += 1) {
                    img = new Image();
                    img.onload = handle_img_LOADED;
                    img.src = imageArray[i].src;
                }
            };
		};

		return AssetModel;
    });
