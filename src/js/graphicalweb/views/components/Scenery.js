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
            function drawSVGHills(yPos, count, xmax, xmin, ymax, ymin) {
                var tostring = 'M 0 ' + yPos,
                    fromstring = 'M 0 ' + yPos,
                    x1, x2, x3, y1, y2, y3, y4, 
                    x = 0, y = 0,
                    i, size;

                for (i = 0; i < count; i += 1) {

                    x = xmin + Math.random() * xmax;
                    size = ymin + Math.random() * ymax;

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

                tostring += 'l 100 500 l -8000 0';
                fromstring += 'l 100 500 l -8000 0';

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
                hillpaths = drawSVGHills(650, 50, 0.5, 20, 50, 20);
                clipGroup[0] = parallaxGroup[0].append('g');
                rect = clipGroup[0].append('rect');
                rect.attr('class', 'hills1');
                rect.attr('width', 9435).attr('height', 900);
                rect.attr('fill', '#a5a5a5');

                clipGroup[0].attr('data-from', hillpaths.from);
                clipGroup[0].attr('data-to', hillpaths.to);
                clipGroup[0].attr('clip-path', 'url(#clip1)');
                clipGroup[0].attr('transform', 'scale(0.75)');

                clips[0] = svg.append('clipPath').attr('id', 'clip1');
                paths[0] = clips[0].append('path').attr('d', clipGroup[0].attr('data-from'));

                //level 2
                hillpaths = drawSVGHills(600, 30, 2, 10, 60, 20);
                parallaxGroup[1] = svg.append('g');
                parallaxGroup[1].attr('class', 'parallax-item');
                parallaxGroup[1].attr('data-offset', '2');

                clipGroup[1] = parallaxGroup[1].append('g');
                rect = clipGroup[1].append('rect');
                rect.attr('class', 'hills2');
                rect.attr('width', 4435).attr('height', 768);
                rect.attr('fill', '#919191');
                rect.attr('opacity', '.73');
                clipGroup[1].attr('data-from', hillpaths.from);
                clipGroup[1].attr('data-to', hillpaths.to);
                clipGroup[1].attr('clip-path', 'url(#clip2)');
                clips[1] = svg.append('clipPath').attr('id', 'clip2');
                paths[1] = clips[1].append('path').attr('d', clipGroup[1].attr('data-from'));

                //level 1
                hillpaths = drawSVGHills(620, 27, 100, 10, 20, 40);
                parallaxGroup[2] = svg.append('g');
                parallaxGroup[2].attr('class', 'parallax-item');
                parallaxGroup[2].attr('data-offset', '1');

                clipGroup[2] = parallaxGroup[2].append('rect');
                clipGroup[2].attr('class', 'hills3');
                clipGroup[2].attr('width', 4435).attr('height', 1200);
                clipGroup[2].attr('fill', '#7c7c7c');
                clipGroup[2].attr('opacity', '.8');
                clipGroup[2].attr('data-from', hillpaths.from);
                clipGroup[2].attr('data-to', hillpaths.to);
                clipGroup[2].attr('clip-path', 'url(#clip3)');
                clips[2] = svg.append('clipPath').attr('id', 'clip3');
                paths[2] = clips[2].append('path').attr('d', clipGroup[2].attr('data-from'));

                //level 0
                clipGroup[3] = svg.append('g');
                rect = clipGroup[3].append('rect');
                rect.attr('class', 'hills4');
                rect.attr('width', 4435).attr('height', 1200);
                rect.attr('fill', '#bbbcb9');

                shape = clipGroup[3].append('path');
                shape.attr('d', 'M6443,1266h2v-27h-0.277c0.352-106.171,0.797-488.374,1.259-498.72c-3.724-3.547-8.072-5.537-13.246-7.423c-9.721-3.545-20.156-0.685-29.217,3.534c-3.904,1.819-9.369,4.533-11.787,8.334c-2.811,4.416-3.844,10.748-4.258,15.908c-0.403,5.013,0.243,369.11-0.568,478.366h-23.751c-2.258-111.204-2.317-477.431-2.64-484.579c-0.959-21.324-0.642-43.272,1.874-64.483c1.364-11.503,0.009-23.388-1.417-34.817c-1.276-10.225-2.464-20.653-4.887-30.663c-4.027-16.641-11.24-33.533-27.138-41.958c-16.253-8.614-35.771-8.872-52.188-0.296c-8.559,4.472-14.961,11.256-18.71,20.113c-3.817,9.017-5.546,18.951-6.996,28.596c-1.379,9.17-2.362,18.121-1.612,27.394c0.794,9.816,2.404,19.555,3.328,29.359c0.892,9.471,1.57,19.223-0.59,28.554c-1.66,7.167-5.83,16.455-12.679,19.96c-5.411,2.769-8.239-4.344-9.794-8.842c-3.795-10.979-3.95-23.038-3.695-34.524c0.513-23.093,1.539-46.157,2.111-69.242c0.508-20.496,1.648-43-5.567-62.52c-6.717-18.17-23.653-30.362-42.085-35.089c-18.115-4.646-36.088,0.877-48.075,15.271c-2.119,2.544-3.931,5.207-5.485,7.965c-4.664,5.822-8.283,12.512-10.644,19.697c-3.007,9.155-3.669,19.196-4.413,28.741c-0.917,11.748-1.123,23.543-1.051,35.322c0.143,23.408,0.359,46.705-0.238,70.11c-0.141,5.529-0.106,11.051,0.034,16.569c-0.812,1.113-1.311,2.546-1.305,4.308c0.054,16.243,1.941,399.145-1.023,515.054h-78.057c-1.064-109.548-1.726-471.195-2.093-476.012c-1.914-25.071,2.818-50.099-0.741-75.143c-3.129-22.013-9.36-43.462-29.313-55.948c-18.69-11.695-45.511-17.376-67.23-12.697c-32.497,6.999-47.285,37.742-52.214,67.901c-2.54,15.544-3.229,31.312-3.312,47.039c-0.036,6.813-0.304,13.7,0.229,20.491c0.524,6.678,1.608,377.021,2.35,484.368h-45.782c-0.146-106.258-0.252-472.885-0.84-477.428c-1.179-9.095-2.972-17.47-8.192-25.188c-5.564-8.227-13.385-14.551-21.775-19.731c-13.149-8.119-28.703-9.814-44.523-10.003c-79.699-0.949-46.018,434.962-43.117,532.351h-292.561c2.546-111.846,3.914-491.104,3.358-503.48c-0.885-19.689-12.922-37.429-30.089-46.937c-16.354-9.059-35.906-11.189-54.331-10.84c-9.74,0.185-18.812,1.036-28.334,3.056c-8.371,1.774-16.797,3.868-23.607,9.334c-8.117,6.515-11.37,16.632-13.263,26.512c-2.171,11.344-2.561,22.996-2.218,34.514c0.248,8.313,0.852,376.83,1.535,487.842h-51.275c-0.459-110.854-0.731-479.63-0.391-487.942c0.522-12.742,1.761-25.521,0.722-38.272c-1.893-23.207-11.082-45.127-27.16-62.056c-14.752-15.533-35.24-19.037-55.328-23.119c-37.72-7.665-74.082,15.131-89.562,49.157c-9.521,20.93-12.987,43.823-15.401,66.521c-1.04,9.781-1.728,387.976-2.685,495.711h-244.51c0.35-106.171,0.796-488.374,1.258-498.72c-3.724-3.547-8.072-5.537-13.246-7.423c-9.721-3.545-20.156-0.685-29.217,3.534c-3.904,1.819-9.369,4.533-11.787,8.334c-2.811,4.416-3.844,10.748-4.258,15.908c-0.403,5.013,0.244,369.11-0.568,478.366h-23.751c-2.259-111.204-2.317-477.431-2.64-484.579c-0.959-21.324-0.642-43.272,1.874-64.483c1.364-11.503,0.009-23.388-1.417-34.817c-1.276-10.225-2.464-20.653-4.887-30.663c-4.027-16.641-11.24-33.533-27.138-41.958c-16.253-8.614-35.771-8.872-52.188-0.296c-8.559,4.472-14.961,11.256-18.71,20.113c-3.817,9.017-5.546,18.951-6.996,28.596c-1.379,9.17-2.362,18.121-1.612,27.394c0.794,9.816,2.404,19.555,3.328,29.359c0.892,9.471,1.57,19.223-0.59,28.554c-1.66,7.167-5.83,16.455-12.679,19.96c-5.411,2.769-8.239-4.344-9.794-8.842c-3.795-10.979-3.95-23.038-3.695-34.524c0.513-23.093,1.539-46.157,2.111-69.242c0.508-20.496,1.648-43-5.567-62.52c-6.717-18.17-23.653-30.362-42.085-35.089c-18.115-4.646-36.088,0.877-48.075,15.271c-2.119,2.544-3.931,5.207-5.485,7.965c-4.664,5.822-8.283,12.512-10.644,19.697c-3.007,9.155-3.669,19.196-4.413,28.741c-0.917,11.748-1.123,23.543-1.051,35.322c0.143,23.408,0.359,46.705-0.238,70.11c-0.141,5.529-0.106,11.051,0.034,16.569c-0.812,1.113-1.311,2.546-1.305,4.308c0.054,16.243,1.942,399.145-1.024,515.054h-78.057c-1.064-109.548-1.725-471.195-2.092-476.012c-1.914-25.071,2.818-50.099-0.741-75.143c-3.129-22.013-9.36-43.462-29.313-55.948c-18.69-11.695-45.511-17.376-67.23-12.697c-32.497,6.999-47.285,37.742-52.214,67.901c-2.54,15.544-3.229,31.312-3.312,47.039c-0.036,6.813-0.304,13.7,0.229,20.491c0.524,6.678,1.609,377.021,2.35,484.368h-45.782c-0.146-106.258-0.251-472.885-0.84-477.428c-1.179-9.095-2.972-17.47-8.192-25.188c-5.564-8.227-13.385-14.551-21.775-19.731c-13.149-8.119-28.703-9.814-44.523-10.003c-79.699-0.949-46.018,434.962-43.117,532.351h-292.561c2.545-111.846,3.914-491.104,3.358-503.48c-0.885-19.689-12.922-37.429-30.089-46.937c-16.354-9.059-35.906-11.189-54.331-10.84c-9.74,0.185-18.812,1.036-28.334,3.056c-8.371,1.774-16.797,3.868-23.607,9.334c-8.117,6.515-11.37,16.632-13.263,26.512c-2.171,11.344-2.561,22.996-2.218,34.514c0.248,8.313,0.852,376.83,1.535,487.842h-51.276c-0.459-110.854-0.73-479.63-0.39-487.942c0.522-12.742,1.761-25.521,0.722-38.272c-1.893-23.207-11.082-45.127-27.16-62.056c-14.752-15.533-35.24-19.037-55.328-23.119c-37.72-7.665-74.082,15.131-89.562,49.157c-9.521,20.93-12.987,43.823-15.401,66.521c-1.04,9.781-1.727,387.976-2.684,495.711h-241.512c0.35-106.171,0.796-488.374,1.258-498.72c-3.724-3.547-8.072-5.537-13.246-7.423c-9.721-3.545-20.156-0.685-29.217,3.534c-3.904,1.819-9.369,4.533-11.787,8.334c-2.811,4.416-3.844,10.748-4.258,15.908c-0.403,5.013,0.243,369.11-0.568,478.366h-23.751c-2.259-111.204-2.317-477.431-2.64-484.579c-0.959-21.324-0.642-43.272,1.874-64.483c1.364-11.503,0.009-23.388-1.417-34.817c-1.276-10.225-2.464-20.653-4.887-30.663c-4.027-16.641-11.24-33.533-27.138-41.958c-16.253-8.614-35.771-8.872-52.188-0.296c-8.559,4.472-14.961,11.256-18.71,20.113c-3.817,9.017-5.546,18.951-6.996,28.596c-1.379,9.17-2.362,18.121-1.612,27.394c0.794,9.816,2.404,19.555,3.328,29.359c0.892,9.471,1.57,19.223-0.59,28.554c-1.66,7.167-5.83,16.455-12.679,19.96c-5.411,2.769-8.239-4.344-9.794-8.842c-3.795-10.979-3.95-23.038-3.695-34.524c0.513-23.093,1.539-46.157,2.111-69.242c0.508-20.496,1.648-43-5.567-62.52c-6.717-18.17-23.653-30.362-42.085-35.089c-18.115-4.646-36.088,0.877-48.075,15.271c-2.119,2.544-3.931,5.207-5.485,7.965c-4.664,5.822-8.283,12.512-10.644,19.697c-3.007,9.155-3.669,19.196-4.413,28.741c-0.917,11.748-1.123,23.543-1.051,35.322c0.143,23.408,0.359,46.705-0.238,70.11c-0.141,5.529-0.106,11.051,0.034,16.569c-0.812,1.113-1.311,2.546-1.305,4.308c0.054,16.243,1.942,399.145-1.024,515.054h-78.057c-1.064-109.548-1.725-471.195-2.092-476.012c-1.914-25.071,2.818-50.099-0.741-75.143c-3.129-22.013-9.36-43.462-29.313-55.948c-18.69-11.695-45.511-17.376-67.23-12.697c-32.497,6.999-47.285,37.742-52.214,67.901c-2.54,15.544-3.229,31.312-3.312,47.039c-0.036,6.813-0.304,13.7,0.229,20.491c0.524,6.678,1.608,377.021,2.35,484.368h-45.782c-0.146-106.258-0.251-472.885-0.84-477.428c-1.179-9.095-2.972-17.47-8.192-25.188c-5.564-8.227-13.385-14.551-21.775-19.731c-13.149-8.119-28.703-9.814-44.523-10.003c-79.699-0.949-46.018,434.962-43.117,532.351h-292.561c2.545-111.846,3.914-491.104,3.358-503.48c-0.885-19.689-12.922-37.429-30.089-46.937c-16.354-9.059-35.906-11.189-54.331-10.84c-9.74,0.185-18.812,1.036-28.334,3.056c-8.371,1.774-16.797,3.868-23.607,9.334c-8.117,6.515-11.37,16.632-13.263,26.512c-2.171,11.344-2.561,22.996-2.218,34.514c0.248,8.313,0.852,376.83,1.535,487.842h-51.276c-0.459-110.854-0.73-479.63-0.39-487.942c0.522-12.742,1.761-25.521,0.722-38.272c-1.893-23.207-11.082-45.127-27.16-62.056c-14.752-15.533-35.24-19.037-55.328-23.119c-37.72-7.665-74.082,15.131-89.562,49.157c-9.521,20.93-12.987,43.823-15.401,66.521c-1.04,9.781-1.728,387.976-2.684,495.711h-242.506c0.351-106.171,0.796-488.374,1.258-498.72c-3.724-3.547-8.072-5.537-13.246-7.423c-9.721-3.545-20.156-0.685-29.217,3.534c-3.904,1.819-9.369,4.533-11.787,8.334c-2.811,4.416-3.844,10.748-4.258,15.908c-0.403,5.013,0.243,369.11-0.568,478.366h-23.751c-2.259-111.204-2.317-477.431-2.64-484.579c-0.959-21.324-0.642-43.272,1.874-64.483c1.364-11.503,0.009-23.388-1.417-34.817c-1.276-10.225-2.464-20.653-4.887-30.663c-4.027-16.641-11.24-33.533-27.138-41.958c-16.253-8.614-35.771-8.872-52.188-0.296c-8.559,4.472-14.961,11.256-18.71,20.113c-3.817,9.017-5.546,18.951-6.996,28.596c-1.379,9.17-2.362,18.121-1.612,27.394c0.794,9.816,2.404,19.555,3.328,29.359c0.892,9.471,1.57,19.223-0.59,28.554c-1.66,7.167-5.83,16.455-12.679,19.96c-5.411,2.769-8.239-4.344-9.794-8.842c-3.795-10.979-3.95-23.038-3.695-34.524c0.513-23.093,1.539-46.157,2.111-69.242c0.508-20.496,1.648-43-5.567-62.52c-6.717-18.17-23.653-30.362-42.085-35.089c-18.115-4.646-36.088,0.877-48.075,15.271c-2.119,2.544-3.931,5.207-5.485,7.965c-4.664,5.822-8.283,12.512-10.644,19.697c-3.007,9.155-3.669,19.196-4.413,28.741c-0.917,11.748-1.123,23.543-1.051,35.322c0.143,23.408,0.359,46.705-0.238,70.11c-0.141,5.529-0.106,11.051,0.034,16.569c-0.812,1.113-1.311,2.546-1.305,4.308c0.054,16.243,1.942,399.145-1.024,515.054h-78.057c-1.064-109.548-1.725-471.195-2.092-476.012c-1.914-25.071,2.818-50.099-0.741-75.143c-3.129-22.013-9.36-43.462-29.313-55.948c-18.69-11.695-45.511-17.376-67.23-12.697c-32.497,6.999-47.285,37.742-52.214,67.901c-2.54,15.544-3.229,31.312-3.312,47.039c-0.036,6.813-0.304,13.7,0.229,20.491c0.524,6.678,1.608,377.021,2.35,484.368h-45.782c-0.146-106.258-0.251-472.885-0.84-477.428c-1.179-9.095-2.972-17.47-8.192-25.188c-5.564-8.227-13.385-14.551-21.775-19.731c-13.149-8.119-28.703-9.814-44.523-10.003c-79.699-0.949-46.018,434.962-43.117,532.351H457.605c2.545-111.846,3.914-491.104,3.358-503.48c-0.885-19.689-12.922-37.429-30.089-46.937c-16.354-9.059-35.906-11.189-54.331-10.84c-9.74,0.185-18.812,1.036-28.334,3.056c-8.371,1.774-16.797,3.868-23.607,9.334c-8.117,6.515-11.371,16.632-13.262,26.512c-2.171,11.344-2.561,22.996-2.218,34.514c0.248,8.313,0.852,376.83,1.536,487.842h-51.276c-0.459-110.854-0.73-479.63-0.39-487.942c0.522-12.742,1.761-25.521,0.722-38.272c-1.893-23.207-11.083-45.127-27.16-62.056c-14.752-15.533-35.24-19.037-55.328-23.119c-37.72-7.665-74.082,15.131-89.562,49.157c-9.521,20.93-12.987,43.823-15.401,66.521c-1.2,11.281-2.133,512.609-3.349,523.891L6443,1266z');
                shape.attr('fill', '#bbbcb9');
                shape.attr('opacity', '.25');
                shape.attr('class', 'hills5');

                clipGroup[3].attr('data-from', 'M 0 650 c 100 0 200 0 300 0 c 100 0 400 0 500 0 c 100 0 200 0 300 0 c 100 0 200 0 300 0 c 100 0 400 0 500 0 c 100 0 200 0 300 0 c 100 0 200 0 300 0 c 100 0 400 0 500 0 c 100 0 200 0 300 0 c 100 0 200 0 300 0 c 100 0 200 0 300 0 c 100 0 400 0 500 0 c 100 0 200 0 300 0 c 100 0 200 0 300 0 c 100 0 200 0 300 0 l 100 500 l -6000 0');
                clipGroup[3].attr('data-to', 'M 0 650 c 100 -50 200 -50 300 0 c 100 -100 400 -100 500 0 c 100 -30 200 -30 300 0 c 100 -100 200 -100 300 0 c 100 -100 400 -100 500 0 c 100 -100 200 -100 300 0 c 100 -40 200 -40 300 0 c 100 -100 400 -100 500 0 c 100 -100 200 -100 300 0 c 100 -100 200 -100 300 0 c 100 -100 200 -100 300 0 c 100 -100 400 -100 500 0 c 100 -100 200 -100 300 0 c 100 -100 200 -100 300 0 c 100 -100 200 -100 300 0 l 100 500 l -6000 0');
                clipGroup[3].attr('clip-path', 'url(#clip4)');
                clips[3] = svg.append('clipPath').attr('id', 'clip4');
                paths[3] = clips[3].append('path').attr('d', clipGroup[3].attr('data-from'));

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
