/*global define $ TWEEN d3*/
define(['text!graphicalweb/views/svg/charSVG.svg', 
        'text!graphicalweb/views/svg/IOS_charSVG.svg', 
        'graphicalweb/utils/CSS3Helper', 
        'graphicalweb/views/components/BaseCharacter', 
        'graphicalweb/controllers/AudioController', 
        'graphicalweb/models/VarsModel'],

	function (svg, svg_noblink, CSS3Helper, BaseCharacter, Audio, VarsModel) {
		
		var CharSVG = function (id) {
			var instance = this,
                $container,
                $dots,
                circle3,
                back,
                path1,
                path2,
                scaled = false,
                scale = {x: 0.5},
                delta = 0,
                offsetX,
                offsetY;

//private
            
//public

            instance.init = function () {
                $container = $(id);

                if (VarsModel.DETAILS === true) {
                    $container.html(svg);
                } else {
                    $container.html(svg_noblink);
                }

                $dots = d3.selectAll(id + ' .svg-dots path');
            };
            
            instance.update = function () {
                delta += 1;

                if (delta % 20 === 0) {
                    $dots.each(function (d, i) {
                        offsetX = (Math.random() * 10) - 5;
                        offsetY = (Math.random() * 10) - 5;
                        d3.select(this).attr('transform', 'translate(' + offsetX + ',' + offsetY + ')');
                    });
                }
            };

            instance.talk = function (value) {
                if (VarsModel.DETAILS === true) {
                    if (value === true) {
                        $container.addClass('talking');
                    } else {
                        $container.removeClass('talking');    
                    }
                }
            };

            instance.start = function () {
                //if (VarsModel.DETAILS === true) {
                    $container.addClass('animating');    
                //}
            };

            instance.stop = function () {
                //if (VarsModel.DETAILS === true) {
                    $container.removeClass('talking');    
                    $container.removeClass('scale');    
                    $container.removeClass('animating');    
                //}
            };

            instance.startSpin = function () {
                if (VarsModel.DETAILS === true) {
                    back = d3.select(id + " .svg-body-distort");
                    path1 = back.attr('d');
                    back.transition().duration(200).attr('d', 'M704.268,499.421c0,0,18.732-19.421,9.732-54.421s-35.649-42.775-35.649-42.775s14.333-14.627,1.991-27.926s-25.473-4.047-25.473-4.047S666,348,638,329s-51.1-4.756-51.1-4.756S568.801,293,524.9,295s-67.111,35.339-67.111,35.339s-28.262-12.424-50.025,7.618s-12.178,42.477-12.178,42.477S361,377,350.549,408.81c-12.312,37.476,6.633,60.324,6.633,60.324s-30.152,28.88-30.152,50.793c0,26.94,18.418,49.579,43.349,56.013c0.278,0.65-9.384,19.291,3.619,39.676s34.815,17.795,34.815,17.795S406,660,440,682s80.786,2.586,80.786,2.586s5.64,12.759,12.739,13.731c4.785,0.655,9.338-1.071,12.495-4.258c4.423,5.497,11.202,9.019,18.807,9.019c13.326,0,24.13-10.804,24.13-24.13c0-0.06-0.004-0.119-0.005-0.179c20.488,15.605,49.772,15.33,70.058-2.158c20.295-17.497,12.435-69.008,12.435-69.008s43.377-6.155,49.832-41.416C729,524,704.268,499.421,704.268,499.421z');
                }
            };

            instance.stopSpin = function () {
                if (VarsModel.DETAILS === true) {
                    if (typeof(back) !== 'undefined') {
                        back.transition().duration(2000).attr('d', path1);
                    }
                }
            };

            instance.scale = function () {
                if (VarsModel.DETAILS === true) {
                    Audio.playSFX('green_sponge');
                    $container.addClass('scale');    
                }
            };

            instance.unscale = function () {
                if (VarsModel.DETAILS === true) {
                    $container.removeClass('scale');    
                }
            };

            instance.moveTo = function (position, speed) {
                $container.animate({'top': position.y, 'left': position.x}, speed);
            };

            instance.init();
		};

		return CharSVG;
    });
