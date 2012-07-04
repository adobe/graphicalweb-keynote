define([],

	function () {
		
		var CharButton = function (element) {
            var instance = this,
                ctx = element.getContext('2d'),
                img = element.getAttribute('data-image'),
                bg = element.getAttribute('data-bg'),
                bgImage = null,
                character = new Image(),
                circle = {r: 20, a: 0.5, fa: 0},
                circleStart = {r: 20, a: 0.5, fa: 0},
                circleEnd = {r: 40, a: 1, fa: 1},
                image = {x: -10, y: 100, s: 0.5},
                imageStart = {x: -10, y: 100, s: 0.5},
                imageEnd = {x: 5, y: 0, s: 1};

//private
            //hex to RGB
            function hexToRGB(hex) {
                var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

                return result ? {
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16)
                } : null;
            }

            /**
            * update method
            */
            function draw() {
                ctx.clearRect(0, 0, element.width, element.height);

                ctx.save();

                //fill
                ctx.beginPath();
                ctx.arc(50, 50, circle.r, 0, Math.PI * 2, true); 
                ctx.closePath();

                ctx.globalAlpha = circle.fa;
                
                //add bg color or image
                if (bgImage === null) {
                    ctx.fillStyle = 'rgb(' + bg.r + ', ' + bg.g + ', ' + bg.b + ')';
                    ctx.fill();
                } else {
                    ctx.clip();
                    ctx.drawImage(bgImage, 0, 0);
                }

                ctx.restore();
                
                //stroke
                ctx.lineWidth = 6;
                ctx.strokeStyle = "rgba(255, 255, 255, " + circle.a + ")";
                ctx.stroke();

                ctx.save();

                //MASK
                ctx.beginPath();
                ctx.moveTo(20, 0);
                ctx.arc(50, 50, circle.r - 3, Math.PI * 3, Math.PI * 2.25, true);
                ctx.lineTo(100, 50);
                ctx.lineTo(100, 0);
                ctx.lineTo(20, 0);
                ctx.closePath();
                ctx.clip();

                //IMAGE
                ctx.translate(image.x + character.width / 2, image.y + character.height / 2); 
                ctx.rotate(0.5);
                ctx.scale(image.s, image.s);
                ctx.translate(-character.width / 2, -character.height / 2); 
                ctx.drawImage(character, image.x, image.y);

                ctx.restore();
            }

            function init() {
                character.src = img;

                //check for bg image
                if (typeof(bg) !== 'undefined' && bg[0] == '#') {
                    bg = hexToRGB(bg);
                } else {
                    bgImage = new Image();
                    bgImage.src = bg;
                }

                draw();
            }


//public

            //unlock
            instance.unlock = function () {
                new TWEEN.Tween(circle)
                .to(circleEnd, 600)
                .easing(TWEEN.Easing.Elastic.EaseOut)
                .onUpdate(draw)
                .start();

                new TWEEN.Tween(image)
                .to(imageEnd, 300)
                .delay(50)
                .easing(TWEEN.Easing.Quartic.EaseOut)
                .start();
            };

            //lock
            instance.lock = function () {
                new TWEEN.Tween(circle)
                .to(circleStart, 200)
                .easing(TWEEN.Easing.Quartic.EaseOut)
                .onUpdate(draw)
                .start();

                new TWEEN.Tween(image)
                .to(imageStart, 300)
                .easing(TWEEN.Easing.Quartic.EaseOut)
                .onUpdate(draw)
                .start();
            };

            init();
		};

		return CharButton;
    });
