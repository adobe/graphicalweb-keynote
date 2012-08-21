/*global define, $, TWEEN, Savage, d3 */
define(['text!graphicalweb/views/html/scenery.html',
        'text!graphicalweb/views/svg/terrain.svg',
        'graphicalweb/controllers/CameraController',
        'graphicalweb/models/VarsModel',
        'graphicalweb/models/AssetModel',
        'graphicalweb/utils/CSS3Helper'
        ],

	function (scenery_html, 
        scenery_svg,
        Camera, 
        VarsModel,
        AssetModel,
        CSS3Helper) {
		
		var Scenery = function () {
			var instance = this,
                //USE_CANVAS = false,
                curvy = false,
                rotated = false,
                moveclouds = true,
                frame = 0,
                goalFrame = 0,
                bgposition = 0,
                delta = {x: -200},
                elementcount = 5,
                parallaxGroupA,
                parallaxGroupB,
                terrainInterval,
                $body,
                $container,
                $cloudsA,
                $cloudsB,
                $leftside,
                $rightside,
                canvas,
                ctx,
                parallaxGroup = [],
                clipGroup = [],
                clips = [],
                paths = [],
                trees = [],
                parallaxA = [],
                imgList = [],
                treegroup1 = [
                    {x: 0, y: 600},
                    {x: 0, y: 570},
                    {x: 0, y: 630},
                    {x: 0, y: 550},
                    {x: 0, y: 630},
                    {x: 0, y: 570},
                    {x: 0, y: 600},
                    {x: 0, y: 610},
                    {x: 0, y: 600},
                    {x: 0, y: 600}
                ],
                bushgroup1 = [
                    {x: 0, y: 610},
                    {x: 0, y: 615},
                    {x: 0, y: 620},
                    {x: 0, y: 550},
                    {x: 0, y: 630},
                    {x: 0, y: 570}
                ],
                grassgroup1 = [
                    {x: 0, y: 550},
                    {x: 0, y: 630},
                    {x: 0, y: 560},
                    {x: 0, y: 610},
                    {x: 0, y: 630},
                    {x: 0, y: 570}
                ],
                treegroup2 = [
                    {x: 0, y: 510},
                    {x: 0, y: 530},
                    {x: 0, y: 480},
                    {x: 0, y: 520},
                    {x: 0, y: 520},
                    {x: 0, y: 500}
                ],
                treegroup3 = [
                    {x: 0, y: 490},
                    {x: 0, y: 480},
                    {x: 0, y: 460},
                    {x: 0, y: 440},
                    {x: 0, y: 480},
                    {x: 0, y: 460},
                    {x: 0, y: 400},
                    {x: 0, y: 400},
                    {x: 0, y: 400}
                ],
                treegroup4 = [
                    {x: 0, y: 430},
                    {x: 0, y: 360},
                    {x: 0, y: 430},
                    {x: 0, y: 395},
                    {x: 0, y: 415},
                    {x: 0, y: 320},
                    {x: 0, y: 400},
                    {x: 0, y: 410},
                    {x: 0, y: 400},
                    {x: 0, y: 400},
                    {x: 0, y: 400}
                ];
                
//private

            /**
             * draw using one canvas
             */
            function draw() {
                var i = 4,
                    img,
                    pattern,
                    num;

                ctx.clearRect(0, 0, canvas.width, canvas.height);

                for (i; i > -1; i -= 1) {
                    img = imgList[i][frame];
                    pattern = ctx.createPattern(img, 'repeat-x');
                    ctx.fillStyle = pattern;
                    ctx.rect(0, 0, canvas.width, canvas.height);
                    ctx.fill();
                    //ctx.drawImage(img, 0, 0);
                }
            }

            /**
             * generate to and from hills in svg format
             */
            function drawSVGHills(yPos, count, max, min) {
                var tostring = 'M 0 ' + yPos,
                    fromstring = 'M 0 ' + yPos,
                    x1, x2, x3, y1, y2, y3, y4, 
                    x = 0, y = 0,
                    i, size;

                for (i = 0; i < count; i += 1) {
                    x += 10;                    

                    size = min + Math.random() * max;
                    x2 = x + size;
                    y2 = y - size;
                    y3 = y2 - size;
                    y4 = y3 - size; 

                    tostring += ' c ' + x + ' ' + 0 + ' ' + x + ' ' + y + ' ' + x + ' ' + y2 + 
                        ' c ' + 0 + ' ' + y3 + ' ' + 0 + ' ' + y4 + ' ' + x2 + ' ' + y4 +
                        ' c ' + x2 + ' ' + 0 + ' ' + x2 + ' ' + -y4 + ' ' + x2 + ' ' + -y4 + 
                        ' c ' + 0 + ' ' + -y2 + ' ' + 0 + ' ' + -y2 + ' ' + x + ' ' + -y2;
                    
                    fromstring += ' c ' + x + ' ' + 0 + ' ' + x + ' ' + 0 + ' ' + x + ' ' + 0 + 
                        ' c ' + 0 + ' ' + 0 + ' ' + 0 + ' ' + 0 + ' ' + x2 + ' ' + 0 +
                        ' c ' + x2 + ' ' + 0 + ' ' + x2 + ' ' + 0 + ' ' + x2 + ' ' + 0 + 
                        ' c ' + 0 + ' ' + 0 + ' ' + 0 + ' ' + 0 + ' ' + x + ' ' + 0;
                }

                tostring += 'l 100 500 l -6000 0';
                fromstring += 'l 100 500 l -6000 0';

                return {from: fromstring, to: tostring};
            }

            function parallax() {
                var i = 0,
                    item,
                    offset,
                    parallaxitems;

                parallaxitems = rotated ? parallaxGroupB : parallaxGroupA;

                for (i; i < parallaxitems.length; i += 1) {
                    item = parallaxitems[i];
                    offset = $(parallaxitems[i]).data('offset');
                    CSS3Helper.setTransform(item, 'translate(' + (delta.x * offset) + 'px, 0px)');
                }
            }

            function updateTerrain() {
                if (frame > goalFrame) {
                    frame -= 1;
                } else if (frame < goalFrame) {
                    frame += 1;
                } else {
                    return;
                }

                draw();
                setTimeout(updateTerrain, 20);
            }

            function setupImageList() {
                var i = 0,
                    num = 0,
                    j, 
                    arr;

                for (i; i < 5; i += 1) {
                    j = 0;
                    arr = [];
                    for (j; j < 10; j += 1) {
                        arr.push(AssetModel.groundA[num].img);
                        num += 1;
                    }
                    imgList.push(arr);
                }
            }

            function addTrees(s, shape, color, count, cl, treey, dist, group) {
                var i, treex, tree;

                for (i = 0; i < count; i += 1) {
                    treex = (i + 1) * dist;
                    tree = s.append('path');
                    tree.attr('d', shape);
                    tree.attr('transform', "translate(" + treex + "," + treey + ")");
                    tree.attr('fill', color);
                    tree.attr('class', cl);
                    tree.attr("data-from", tree.attr('transform'));
                    tree.attr("data-to", "translate(" + treex + "," + group[i].y + ")");
                    trees.push(tree);
                }
            }
            
            function setupSVG() {
                var i, j,
                    tree, treex, bush, bushx, svg, rects = [], rect, shape, hillpaths;

                $('#parallaxB').append(scenery_svg);
                
                //create animated svg
                svg = d3.select("#parallaxA").append("svg");
                svg.attr("width", 4435).attr("height", 1200);
                svg.attr("class", "scene-svg");
                
                //level 3
                parallaxGroup[0] = svg.append('g');
                parallaxGroup[0].attr('class', 'parallax-item');
                parallaxGroup[0].attr('data-offset', '3');

                //mountains
                clipGroup[0] = parallaxGroup[0].append('g');
                rect = clipGroup[0].append('rect');
                rect.attr('class', 'hills1');
                rect.attr('width', 4435).attr('height', 768);
                rect.attr('fill', '#d5d5d5');

                clipGroup[0].attr('data-from', 'M4402.738,455.827c-23.916,0-23.916,0-47.834,0s-23.918,0-47.834,0c-23.918,0-23.918,0-47.836,0c-23.916,0-23.916,0-47.834,0s-23.918,0-47.834,0c-23.918,0-23.918,0-47.838,0c-23.916,0-23.916,0-47.834,0s-23.918,0-47.834,0c-23.918,0-23.918,0-47.838,0c-23.916,0-23.916,0-47.834,0s-23.918,0-47.834,0c-23.918,0-23.918,0-47.836,0s-23.918,0-47.834,0c-23.918,0-23.918,0-47.836,0s-23.918,0-47.836,0c-23.916,0-23.916,0-47.834,0s-23.918,0-47.836,0s-23.918,0-47.836,0s-23.918,0-47.836,0s-23.918,0-47.836,0s-23.918-1.193-47.836-1.193s-23.918,1.193-47.836,1.193s-23.918,0-47.836,0s-23.918,0-47.836,0s-23.918,0-47.836,0c-23.916,0-23.916,0-47.834,0s-23.918,0-47.836,0s-23.918,0-47.836,0s-23.918,0-47.838,0c-23.916,0-23.916,0-47.834,0s-23.918,0-47.838,0c-23.916,0-23.916,0-47.834,0s-23.918,0-47.838,0c-23.918,0-23.918,0-47.836,0c-23.916,0-23.916,0-47.832,0s-23.916,0-47.83,0c-23.918,0-23.918,0-47.834,0s-23.916,0-47.834,0c-23.914,0-23.914,0-47.83,0c-23.918,0-23.918,0-47.836,0c-23.916,0-23.916,0-47.832,0s-23.916,0-47.832,0c-23.92,0-23.92,0-47.838,0c-23.916,0-23.916,0-47.832,0c-23.918,0-23.918,0-47.834,0c-23.918,0-23.918,0-47.836,0c-23.916,0-23.916,0-47.832,0c-23.918,0-23.918,0-47.838,0c-23.916,0-23.916,0-47.834,0s-23.918,0-47.836,0s-23.918,0-47.834,0c-23.918,0-23.918,0-47.838,0c-23.916,0-23.916,0-47.834,0s-23.918,0-47.838,0c-23.916,0-23.916,0-47.834,0s-23.918,0-47.838,0c-23.918,0-23.916,0-47.834,0s-23.918,0-47.836,0c-23.92,0-23.92,0-47.838,0s-23.918,0-47.836,0s-23.918,0-47.836,0c-23.92,0-23.92,0-47.84,0c-23.918,0-23.918,0-47.836,0s-23.918,0-47.836,0s-23.918,0-47.836,0c-23.92,0-23.92,0-47.838,0c-23.92,0-23.92,0-47.84,0s-23.92,0-47.838,0c-23.92,0-23.92,0-47.84,0s-23.92,0-47.838,0c-23.92,0-23.92,0-47.838,0c-23.92,0-23.92,0-47.838,0c-23.92,0-23.92,0-47.838,0c-23.92,0-23.92,0-47.84,0s-23.92,0-47.838,0c-23.92,0-23.92,0-47.84,0s-23.92,0-47.838,0c-23.92,0-23.92,0-47.84,0s-23.92,0-47.84,0c-23.916,0-23.916,0-47.834,0s-23.918,0-47.836,0c-23.92,0-23.92,0-47.84,0c-23.918,0-23.918,0-47.837,0c-23.919,0-23.919,0-47.839,0c-23.918,0-23.918,0-47.837,0c-23.919,0-23.919,0-47.839,0s-23.919,0-47.839,0c-23.921,0-23.921,0-47.842,0s-23.921,0-47.842,0c-23.92,0-23.92,0-47.841,0c-23.921,0-23.921,0-47.843,0c-23.92,0-23.92,0-47.84,0c-0.616,0-1.212-0.076-1.797,0v768h4435v455.827c4423.998,455.827,4419.926,455.827,4402.738,455.827z');
                clipGroup[0].attr('data-to', 'M4402.738,409.891c-23.916,0-23.916-16.267-47.834-16.267s-23.918,25.312-47.834,25.312c-23.918,0-23.918-54.833-47.836-54.833c-23.916,0-23.916,48.942-47.834,48.942s-23.918-91.232-47.834-91.232c-23.918,0-23.918,112.102-47.838,112.102c-23.916,0-23.916-98.037-47.834-98.037s-23.918,24.844-47.834,24.844c-23.918,0-23.918,34.378-47.838,34.378c-23.916,0-23.916-90.226-47.834-90.226s-23.918,44.382-47.834,44.382c-23.918,0-23.918,84.521-47.836,84.521s-23.918-33.216-47.834-33.216c-23.918,0-23.918-85.547-47.836-85.547s-23.918,96.386-47.836,96.386c-23.916,0-23.916-47.062-47.834-47.062s-23.918,65.458-47.836,65.458s-23.918-37.603-47.836-37.603s-23.918-18.963-47.836-18.963s-23.918,60.04-47.836,60.04s-23.918,15.533-47.836,15.533s-23.918-31.13-47.836-31.13s-23.918-103.016-47.836-103.016s-23.918,99.299-47.836,99.299s-23.918-16.29-47.836-16.29c-23.916,0-23.916-72.287-47.834-72.287s-23.918,104.572-47.836,104.572s-23.918,0.727-47.836,0.727s-23.918-112.816-47.838-112.816c-23.916,0-23.916,93.445-47.834,93.445s-23.918-63.646-47.838-63.646c-23.916,0-23.916,76.929-47.834,76.929s-23.918-47.853-47.838-47.853c-23.918,0-23.918,59.188-47.836,59.188c-23.916,0-23.916-34.322-47.832-34.322s-23.916,22.663-47.83,22.663c-23.918,0-23.918-2.019-47.834-2.019s-23.916-77.129-47.834-77.129c-23.914,0-23.914,57.779-47.83,57.779c-23.918,0-23.918,21.823-47.836,21.823c-23.916,0-23.916-65.511-47.832-65.511s-23.916,89.524-47.832,89.524c-23.92,0-23.92-31.635-47.838-31.635c-23.916,0-23.916,22.956-47.832,22.956c-23.918,0-23.918-86.899-47.834-86.899c-23.918,0-23.918,41.763-47.836,41.763c-23.916,0-23.916-74.859-47.832-74.859c-23.92,0-23.92,122.481-47.838,122.481c-23.916,0-23.916-43.182-47.834-43.182s-23.918-53.135-47.836-53.135s-23.918,87.116-47.834,87.116c-23.92,0-23.92-41.411-47.838-41.411c-23.916,0-23.916,25.549-47.834,25.549s-23.918-95.072-47.838-95.072c-23.916,0-23.916,107.309-47.834,107.309s-23.918-89.945-47.838-89.945c-23.918,0-23.918,105.822-47.836,105.822c-23.916,0-23.916-30.711-47.834-30.711c-23.92,0-23.92-80.547-47.838-80.547s-23.918,62.859-47.836,62.859s-23.918-91.01-47.836-91.01c-23.92,0-23.92,106.433-47.84,106.433c-23.918,0-23.918-28.378-47.836-28.378s-23.918,40.077-47.836,40.077s-23.918-103.779-47.838-103.779c-23.918,0-23.918,105.795-47.836,105.795c-23.92,0-23.92-18.489-47.84-18.489s-23.92,9.5-47.838,9.5c-23.92,0-23.92-57.052-47.84-57.052s-23.92,44.183-47.84,44.183c-23.918,0-23.918-72.319-47.838-72.319c-23.918,0-23.918,92.194-47.838,92.194c-23.918,0-23.918-111.578-47.836-111.578c-23.922,0-23.922,108.041-47.842,108.041c-23.918,0-23.918-42.549-47.838-42.549s-23.92,2.341-47.838,2.341c-23.92,0-23.92-68.62-47.84-68.62c-23.918,0-23.918,93.136-47.838,93.136s-23.92-51.614-47.84-51.614c-23.918,0-23.918,69.081-47.834,69.081c-23.918,0-23.918,6.511-47.836,6.511c-23.92,0-23.92-61.143-47.841-61.143c-23.918,0-23.918,44.471-47.837,44.471c-23.919,0-23.919-94.331-47.839-94.331c-23.918,0-23.918,91.588-47.837,91.588c-23.919,0-23.919,6.229-47.839,6.229s-23.919-82.778-47.839-82.778c-23.921,0-23.921,63.681-47.842,63.681s-23.921,1.675-47.842,1.675c-23.92,0-23.92-71.316-47.841-71.316c-23.921,0-23.921,71.247-47.843,71.247c-23.92,0-23.92-30.831-47.84-30.831c-0.616,0-1.212,0.048-1.797,0.124v768h4435v321.665c4424.764,353.438,4419.926,409.891,4402.738,409.891z');
                clipGroup[0].attr('clip-path', 'url(#clip1)');

                clips[0] = svg.append('clipPath').attr('id', 'clip1');
                paths[0] = clips[0].append('path').attr('d', clipGroup[0].attr('data-from'));

                //level 2
                parallaxGroup[1] = svg.append('g');
                parallaxGroup[1].attr('class', 'parallax-item');
                parallaxGroup[1].attr('data-offset', '2');

                clipGroup[1] = parallaxGroup[1].append('g');
                rect = clipGroup[1].append('rect');
                rect.attr('class', 'hills2');
                rect.attr('width', 4435).attr('height', 768);
                rect.attr('fill', '#c2c2c2');
                clipGroup[1].attr('data-from', 'M4338.957,485c-88.047,0-88.047,0-176.093,0c-88.048,0-88.048,0-176.095,0c-88.046,0-88.046,0-176.092,0c-88.047,0-88.047,0-176.094,0s-88.047,0-176.095,0c-88.044,0-88.044,0-176.088,0c-88.046,0-88.046,0-176.091,0s-88.045,0-176.091,0c-88.045,0-88.045,0-176.09,0c-88.048,0-88.048,0-176.096,0c-88.046,0-88.046,0-176.092,0s-88.046,0-176.092,0c-88.048,0-88.048,0-176.096,0c-88.047,0-88.047,0-176.095,0c-88.047,0-88.047,0-176.094,0s-88.047,0-176.095,0s-88.048,0-176.096,0s-88.048,0-176.097,0c-88.047,0-88.047,0-176.095,0c-88.046,0-88.046,0-176.093,0c-88.048,0-88.048,0-176.095,0c-88.049,0-88.049,0-176.098,0c-88.048,0-88.048,0-176.096,0c-88.052,0-88.052,0-176.104,0C52.287,485,35.33,485,0,485v283h4435v485C4412,485,4388.822,485,4338.957,485z');
                clipGroup[1].attr('data-to', 'M4338.957,439.62c-88.047,0-88.047,44-176.093,44c-88.048,0-88.048-44-176.095-44c-88.046,0-88.046,44-176.092,44c-88.047,0-88.047-44-176.094-44s-88.047,44-176.095,44c-88.044,0-88.044-44-176.088-44c-88.046,0-88.046,44-176.091,44s-88.045-44-176.091-44c-88.045,0-88.045,44-176.09,44c-88.048,0-88.048-44-176.096-44c-88.046,0-88.046,44-176.092,44s-88.046-44-176.092-44c-88.048,0-88.048,44-176.096,44c-88.047,0-88.047-44-176.095-44c-88.047,0-88.047,44-176.094,44s-88.047-44-176.095-44s-88.048,44-176.096,44s-88.048-44-176.097-44c-88.047,0-88.047,44-176.095,44c-88.046,0-88.046-44-176.093-44c-88.048,0-88.048,44-176.095,44c-88.049,0-88.049-44-176.098-44c-88.048,0-88.048,44-176.096,44c-88.052,0-88.052-44-176.104-44c-60.409,0-78.762,17.837-112.696,30.99v768h4435v463.415C4410.029,451.773,4388.822,439.62,4338.957,439.62z');
                clipGroup[1].attr('clip-path', 'url(#clip2)');
                clips[1] = svg.append('clipPath').attr('id', 'clip2');
                paths[1] = clips[1].append('path').attr('d', clipGroup[1].attr('data-from'));

                //level 1
                
                hillpaths = drawSVGHills(650, 10, 20, 70);
                parallaxGroup[2] = svg.append('g');
                parallaxGroup[2].attr('class', 'parallax-item');
                parallaxGroup[2].attr('data-offset', '1');

                clipGroup[2] = parallaxGroup[2].append('rect');
                clipGroup[2].attr('class', 'hills3');
                clipGroup[2].attr('width', 4435).attr('height', 1200);
                clipGroup[2].attr('fill', '#cdcdcd');
                clipGroup[2].attr('data-from', hillpaths.from);
                clipGroup[2].attr('data-to', hillpaths.to);
                clipGroup[2].attr('clip-path', 'url(#clip3)');
                clips[2] = svg.append('clipPath').attr('id', 'clip3');
                paths[2] = clips[2].append('path').attr('d', clipGroup[2].attr('data-from'));

                /*
                //level 0
                clipGroup[3] = svg.append('g');
                rect = clipGroup[3].append('rect');
                rect.attr('class', 'hills4');
                rect.attr('width', 4435).attr('height', 1200);
                rect.attr('fill', '#808080');

                shape = clipGroup[3].append('path');
                shape.attr('d', 'M4868.375,671.5c-59,10,10.151-64.753-68.144-62.729c-66.856,1.729-21.856,62.729-54.575,56.742c-44.381-8.12,25.719-219.014-73.229-214.344s-19.117,164.529-64.199,161.894c-43.854-2.563,35.146-213.525-65.724-213.524c-120.722,0.001-12.874,285.366-107.091,294.635c-82.605,8.126,8.881-196.539-118.039-199.569s-39,193.896-91.242,196.105c-52.241,2.21-4.758-96.861-86.109-107.641c-76.685-10.161-47.648,110.431-107.648,113.431s-69.961,11.72-183.961,9.72s13.806-130.602-134.877-151.92c-155.461-22.29-32.162,168.2-99.264,169.074c-67.101,0.874,28.074-203.099-115.948-219.98c-129.057-15.128-98.95,191.106-121.671,188.5s22.654-114.164-53.525-122.394c-58.912-6.364-18.938,93.525-50.754,98.073s-46.144,2.027-57.35,3.927c-59,10,10.151-64.753-68.144-62.729c-66.856,1.729-21.856,62.729-54.575,56.742c-44.381-8.12,25.719-219.014-73.229-214.344s-19.117,164.529-64.199,161.894c-43.854-2.563,35.146-213.525-65.724-213.524c-120.722,0.001-12.874,285.366-107.091,294.635c-82.605,8.126,8.881-196.539-118.039-199.569s-39,193.896-91.242,196.105c-52.241,2.21-4.758-96.861-86.109-107.641c-76.685-10.161-47.648,110.431-107.648,113.431s-69.961,11.72-183.961,9.72s13.806-130.602-134.877-151.92c-155.461-22.29-32.162,168.2-99.264,169.074c-67.101,0.874,28.074-203.099-115.948-219.98c-129.057-15.128-98.95,191.106-121.671,188.5s22.654-114.164-53.525-122.394c-58.912-6.364-39.858,99.209-71.112,101c-12.016,0.688-31.219-3.144-55.667,1c-59,10,10.151-64.753-68.144-62.729C1408,610.5,1453,671.5,1420.281,665.514C1375.9,657.394,1446,446.5,1347.053,451.17s-19.117,164.529-64.199,161.894C1239,610.5,1318,399.538,1217.13,399.539c-120.722,0.001-12.874,285.366-107.091,294.635C1027.434,702.3,1118.92,497.635,992,494.604S953,688.5,900.758,690.71c-52.241,2.21-4.758-96.861-86.109-107.641C737.964,572.908,767,693.5,707,696.5s-69.961,11.72-183.961,9.72s13.806-130.602-134.876-151.92C232.701,532.01,356,722.5,288.899,723.374s28.074-203.099-115.949-219.98C43.894,488.266,74,694.5,51.279,691.894S73.934,577.729-2.246,569.5c-58.912-6.364,0.246,95-80.754,95V768h5007.375v-98.5C4924.375,669.5,4927.375,661.5,4868.375,671.5z');
                shape.attr('fill', '#6e6e6e');
                shape.attr('class', 'hills5');

                clipGroup[3].attr('data-from', 'M 0 650 c 100 0 200 0 300 0 c 100 0 400 0 500 0 c 100 0 200 0 300 0 c 100 0 200 0 300 0 c 100 0 400 0 500 0 c 100 0 200 0 300 0 c 100 0 200 0 300 0 c 100 0 400 0 500 0 c 100 0 200 0 300 0 c 100 0 200 0 300 0 c 100 0 200 0 300 0 c 100 0 400 0 500 0 c 100 0 200 0 300 0 c 100 0 200 0 300 0 c 100 0 200 0 300 0 l 100 500 l -6000 0');
                clipGroup[3].attr('data-to', 'M 0 650 c 100 -50 200 -50 300 0 c 100 -100 400 -100 500 0 c 100 -30 200 -30 300 0 c 100 -100 200 -100 300 0 c 100 -100 400 -100 500 0 c 100 -100 200 -100 300 0 c 100 -40 200 -40 300 0 c 100 -100 400 -100 500 0 c 100 -100 200 -100 300 0 c 100 -100 200 -100 300 0 c 100 -100 200 -100 300 0 c 100 -100 400 -100 500 0 c 100 -100 200 -100 300 0 c 100 -100 200 -100 300 0 c 100 -100 200 -100 300 0 l 100 500 l -6000 0');
                clipGroup[3].attr('clip-path', 'url(#clip4)');
                clips[3] = svg.append('clipPath').attr('id', 'clip4');
                paths[3] = clips[3].append('path').attr('d', clipGroup[3].attr('data-from'));
                */

                parallaxGroupA = $('#parallaxA').find('.parallax-item');
                parallaxGroupB = $('#parallaxB').find('.parallax-item');
            }

            function animateSVGFlat() {
                for (var i = 0; i < clipGroup.length; i += 1) {
                    paths[i].transition().duration(2000).attr('d', clipGroup[i].attr('data-from'));
                }

                for (var i = 0; i < trees.length; i += 1) {
                    trees[i].transition().duration(2000).attr('transform', trees[i].attr('data-from'));
                }
            }

            function animateSVGCurve() {
                for (var i = 0; i < clipGroup.length; i += 1) {
                    paths[i].transition().duration(2000).attr('d', clipGroup[i].attr('data-to'));
                }

                for (var i = 0; i < trees.length; i += 1) {
                    trees[i].transition().duration(2000).attr('transform', trees[i].attr('data-to'));
                }
            }

            function setupCanvas() {
                canvas = $('#groundA1')[0];
                ctx = canvas.getContext('2d');

                AssetModel.loadGroup(1, function () {
                    setupImageList();
                    draw();    
                });
            }
          
//public
            instance.init = function () {
                var i = 0,
                    element;

                $body = $('body');
                $container = $('#layer1');
                $cloudsA = $('#cloudsA');
                $cloudsB = $('#cloudsB');
                $leftside = $('#cube1 .left');
                $rightside = $('#cube1 .right');
                $backside = $('#cube1 .back2');

                setupSVG();
            };

            instance.setParallax = function (goal) {
                if (VarsModel.DETAILS === true) {
                    delta = {x: goal};
                    parallax();
                }
            };

            instance.animateParallax = function (goal, duration) {
                if (VarsModel.DETAILS === true) {
                    var end = {x: goal};

                    new TWEEN.Tween(delta)
                        .to(end, duration)
                        .onUpdate(parallax)
                        .start();
                }
            };

            instance.update = function () {
                if (moveclouds === true && VarsModel.DETAILS === true) {
                    bgposition -= 1;
                    if (rotated !== true) {
                        $cloudsA.css({backgroundPosition: bgposition + 'px 150px'});
                    } else {
                        $cloudsB.css({backgroundPosition: bgposition + 'px 150px'});
                    }
                }
            };

    //state methods

            instance.setState = function (newState) {

                switch (newState) 
                {
                case "css":
                    $body.removeClass('night');
                    $body.removeClass('space');
                    $body.addClass('css');
                    $leftside.hide();
                    $rightside.hide();
                    $backside.hide();
                    instance.removeCurves();
                    instance.unrotate();
                    moveclouds = true;
                    break;
                case "svg":
                    $body.removeClass('night');
                    $body.removeClass('space');
                    $body.addClass('css');
                    $leftside.hide();
                    $rightside.hide();
                    $backside.hide();
                    instance.addCurves();
                    instance.unrotate();
                    moveclouds = true;
                    break;
                case "3d":
                    $body.removeClass('night');
                    $body.addClass('css');
                    $body.addClass('space');
                    $leftside.show();
                    $rightside.show();
                    $backside.show();
                    instance.addCurves();
                    instance.unrotate();
                    moveclouds = false;
                    break;
                case "webgl":
                    $body.removeClass('night');
                    $body.addClass('css');
                    $body.addClass('space');
                    $leftside.show();
                    $rightside.show();
                    $backside.show();
                    instance.addCurves();
                    instance.unrotate();
                    moveclouds = false;
                    //instance.rotate();
                    break;
                case "blend":
                    $body.removeClass('space');
                    $body.addClass('css');
                    $body.addClass('night');
                    $leftside.hide();
                    $rightside.hide();
                    $backside.hide();
                    instance.rotate();
                    moveclouds = true;
                    break;
                case "shader":
                    $body.removeClass('space');
                    $body.removeClass('night');
                    $body.addClass('css');
                    $leftside.hide();
                    $rightside.hide();
                    $backside.hide();
                    instance.rotate();
                    moveclouds = true;
                    break;
                default:
                    moveclouds = true;
                    instance.removeAll();
                    instance.unrotate();
                    break;
                }
            }

            instance.removeCurves = function () {
                //if (USE_CANVAS === true) {
                //    goalFrame = 4;
                //    updateTerrain();
                //} else {
                    if (curvy === true) {
                        animateSVGFlat();
                    }
                //}

                curvy = false;
            };

            instance.addCurves = function () {
                
                _log('add curve', curvy);
                //if (USE_CANVAS === true) {
                //    goalFrame = 9;
                //    updateTerrain();
                //} else {
                    if (curvy === false) {
                        animateSVGCurve();
                    }
                //}

                curvy = true;
            };

            instance.rotate = function () {
                CSS3Helper.setTransform($('#planet1')[0], 'translateZ(-1000px) rotateY(180deg)');
                rotated = true;
            };

            instance.unrotate = function () {
                CSS3Helper.setTransform($('#planet1')[0], 'translateZ(-1000px)');
                rotated = false;
            };

            instance.removeAll = function () {
                $body.removeClass('space');
                $body.removeClass('css');
                $leftside.hide();
                $rightside.hide();
                instance.removeCurves();
            };

		};

		return new Scenery();
    });
