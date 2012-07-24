define([],

	function () {
		
		var AssetModel = function () {
			var instance = this,
                currentGroup,
                num,
                i, j;

            instance.group0 = [
                {src: '../img/intro/ground-shading.svg'},
                {src: '../img/intro/cloud-1.svg'},
                {src: '../img/intro/cloud-2.svg'},
                {src: '../img/intro/bush-1.svg'},
                {src: '../img/intro/grass.svg'},
                {src: '../img/intro/tree-1.svg'},
                {src: '../img/intro/tree-2.svg'},
                {src: '../img/intro/tree-3.svg'},
                {src: '../img/intro/tree-4.svg'},
                {src: '../img/intro/tree-5.svg'},
                {src: '../img/intro/tree-6.svg'},
                {src: '../img/intro/tree-7.svg'}
            ];


            instance.group1 = [

            ];

            instance.groundA = [];
            for (i = 0; i < 5; i += 1) {
                num = i + 1;
                for (j = 0; j < 1; j += 1) {
                    instance.groundA[i] = {src: '../img/terrain/groundA' + num + '/groundA' + num + '_' + j + '.png'};
                }
            }

            instance.imageGroups = [
                {arr: instance.group0, loaded: false},
                {arr: instance.groundA, loaded: false},
                {arr: instance.group1, loaded: false}
            ];

            
//private
            
            
//public

			instance.loadGroup = function (group, callback) {
                var i = 0,
                    img,
                    loadedImages = 0,
                    currentGroup = instance.imageGroups[group],
                    imageArray = currentGroup.arr;

                function handle_img_LOADED(e) {
                    loadedImages += 1;

                    if (loadedImages == imageArray.length) {
                        currentGroup.loaded = true;
                        callback();
                    }
                }

                if (currentGroup.loaded !== true) {
                    for (i; i < imageArray.length; i += 1) {
                        img = new Image();
                        img.onload = handle_img_LOADED;
                        img.src = imageArray[i].src;
                    }
                } else {
                    callback();
                }
            };
		};

		return new AssetModel();
    });
