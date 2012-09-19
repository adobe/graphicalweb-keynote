/*global define, $, TWEEN, Savage, d3 */
define(['text!graphicalweb/views/html/scenery.html',
        'text!graphicalweb/views/svg/terrain.svg',
        'graphicalweb/controllers/CameraController',
        'graphicalweb/controllers/AudioController',
        'graphicalweb/models/VarsModel',
        'graphicalweb/models/AssetModel',
        'graphicalweb/utils/CSS3Helper'
        ],

	function (scenery_html, 
        scenery_svg,
        Camera, 
        Audio,
        VarsModel,
        AssetModel,
        CSS3Helper) {
		
		var Scenery = function () {
			var instance = this,
                //USE_CANVAS = false,
                curvy = false,
                rotated = false,
                moveclouds = false,
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
                $backside,
                $frontside,
                $frontside2,
                $bottomside,
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
            //function draw() {
            //    var i = 4,
            //        img,
            //        pattern,
            //        num;

            //    ctx.clearRect(0, 0, canvas.width, canvas.height);

            //    for (i; i > -1; i -= 1) {
            //        img = imgList[i][frame];
            //        pattern = ctx.createPattern(img, 'repeat-x');
            //        ctx.fillStyle = pattern;
            //        ctx.rect(0, 0, canvas.width, canvas.height);
            //        ctx.fill();
            //        //ctx.drawImage(img, 0, 0);
            //    }
            //}

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

                    //x2 = x + size;
                    x2 = x;
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

                tostring += 'l 100 500 l -10000 0';
                fromstring += 'l 100 500 l -10000 0';

                return {from: fromstring, to: tostring};
            }

            /**
             * update parallax items
             */
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

            /**
             * update terrain for canvas drawing
             */
            //function updateTerrain() {
            //    if (frame > goalFrame) {
            //        frame -= 1;
            //    } else if (frame < goalFrame) {
            //        frame += 1;
            //    } else {
            //        return;
            //    }

            //    draw();
            //    setTimeout(updateTerrain, 20);
            //}

            //function setupImageList() {
            //    var i = 0,
            //        num = 0,
            //        j, 
            //        arr;

            //    for (i; i < 5; i += 1) {
            //        j = 0;
            //        arr = [];
            //        for (j; j < 10; j += 1) {
            //            arr.push(AssetModel.groundA[num].img);
            //            num += 1;
            //        }
            //        imgList.push(arr);
            //    }
            //}

            /**
             * add trees to scenery
             */
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
            
            /**
             * setup svg elements
             */
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

                addTrees(parallaxGroup[0],
                    "M6.102-24.8c-0.028-3.445,0.163-7.028-0.49-10.427c-0.452-2.353-1.361-4.454-3.956-4.809c-0.305-0.042-0.611-0.051-0.917-0.037c-1.956-0.502-4.75-0.524-5.788,1.459c-0.431,0.823-0.507,1.693-0.521,2.591c-0.126,0.11-0.222,0.262-0.252,0.465c-0.45,3.025,0.087,5.896,0.124,8.912c0.001,0.113,0.003,0.225,0.004,0.337c-0.004,0.089-0.007,0.177-0.011,0.266c-0.031,0.738-0.001,1.479,0.047,2.22c0.032,2.203,0.054,4.405-0.007,6.609c-0.068,2.488-0.397,5.098,1.017,7.312c0.784,1.228,1.965,2.166,3.32,2.602c-0.071,1.847-0.162,3.693-0.146,5.542c0.011,1.324-0.26,4.451,1.298,5.09C0.678,3.682,1.572,3.21,1.868,2.374C2.16,1.547,1.96,0.672,1.912-0.173C1.775-2.585,2.063-4.988,2.11-7.388c0.096-0.044,0.192-0.089,0.283-0.141c0.818-0.238,1.624-0.595,2.208-1.098c1.747-1.5,2.009-4.508,2.031-6.643C6.665-18.451,6.128-21.614,6.102-24.8z",
                    "#a5a5a5", 10, "trees1", 490, 700, treegroup1);

                //mountains
                hillpaths = drawSVGHills(650, 70, 30, 20, 60, 20);
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
                hillpaths = drawSVGHills(550, 50, 30, 30, 30, 20);
                parallaxGroup[1] = svg.append('g');
                parallaxGroup[1].attr('class', 'parallax-item');
                parallaxGroup[1].attr('data-offset', '2');
                parallaxGroup[1].attr('opacity', '.73');

                addTrees(parallaxGroup[1],
                    "M16.9-37.648c-1.207-2.599-3.505-4.581-5.605-6.544c2.264-2.819,4.195-6.038,3.32-9.834c-0.619-2.689-2.896-5.243-5.54-6.431c1.971-2.992,3.085-6.372,2.352-10.109c-0.841-4.285-4.437-6.598-8.359-7.793c-4.358-1.328-10.153-1.335-14.139,1.067c-1.114,0.671-2.096,1.493-2.925,2.425c-1.817,1.72-3.034,4.209-3.499,6.677c-0.428,2.271-0.053,4.582,1.397,6.428c0.815,1.039,1.863,1.649,2.975,2.17c-2.611,2.064-4.127,5.784-4.465,8.907c-0.235,2.177,0.1,4.781,1.702,6.41c0.701,0.713,1.605,1.195,2.59,1.523c-1.861,2.045-2.989,5.029-3.545,7.54c-1.063,4.8,1.043,8.822,5.285,11.218c2.329,1.315,5.175,2.26,8.169,2.725c-0.15,4.582-0.424,9.161-0.384,13.75c0.025,2.791-0.547,9.38,2.736,10.726C0.76,3.94,2.645,2.946,3.268,1.183c0.616-1.742,0.194-3.585,0.093-5.366C3.039-9.849,3.83-15.49,3.79-21.128c5.133-0.626,9.838-2.923,12.25-7.465C17.578-31.491,18.33-34.57,16.9-37.648z",
                    "#919191", 5, "trees2", 550, 650, treegroup2);

                clipGroup[1] = parallaxGroup[1].append('g');
                rect = clipGroup[1].append('rect');
                rect.attr('class', 'hills2');
                rect.attr('width', 4435).attr('height', 768);
                rect.attr('fill', '#919191');
                clipGroup[1].attr('data-from', hillpaths.from);
                clipGroup[1].attr('data-to', hillpaths.to);
                clipGroup[1].attr('clip-path', 'url(#clip2)');
                clips[1] = svg.append('clipPath').attr('id', 'clip2');
                paths[1] = clips[1].append('path').attr('d', clipGroup[1].attr('data-from'));

                //level 1

                hillpaths = drawSVGHills(620, 27, 90, 80, 40, 20);
                parallaxGroup[2] = svg.append('g');
                parallaxGroup[2].attr('class', 'parallax-item');
                parallaxGroup[2].attr('opacity', '.8');
                parallaxGroup[2].attr('data-offset', '1');

                addTrees(parallaxGroup[2],
                    "M24.312-83.06C16.069-93.993,2.185-99.694-11.172-95.147c-14.079,4.792-21.665,18.908-20.812,33.391c0.481,8.171,3.116,16.676,8.96,22.614c4.374,4.443,10.19,7.209,16.231,8.596c0.229,1.154,0.478,2.307,0.682,3.482c0.515,2.978,0.583,6.162,0.804,9.176c0.453,6.174,1.402,12.278,1.46,18.49C-3.783,7.503,6.874,7.585,6.874,0.679V-0.75c0-0.284-0.024-0.551-0.059-0.811C6.593-7.004,5.812-12.38,5.415-17.811c-0.229-3.121-0.408-6.266-0.684-9.379c-0.163-1.834-0.719-3.595-1.091-5.391c9.627-0.169,18.789-4.448,24.208-13.076C35.165-57.308,32.245-72.535,24.312-83.06z",
                    "#7c7c7c", 5, "trees3", 620, 800, treegroup2);

                clipGroup[2] = parallaxGroup[2].append('rect');
                clipGroup[2].attr('class', 'hills3');
                clipGroup[2].attr('width', 4435).attr('height', 1200);
                clipGroup[2].attr('fill', '#7c7c7c');
                clipGroup[2].attr('data-from', hillpaths.from);
                clipGroup[2].attr('data-to', hillpaths.to);
                clipGroup[2].attr('clip-path', 'url(#clip3)');
                clips[2] = svg.append('clipPath').attr('id', 'clip3');
                paths[2] = clips[2].append('path').attr('d', clipGroup[2].attr('data-from'));

                //level 0
                
                addTrees(svg,
                    "M34.021-118.95c-11.534-15.301-30.963-23.278-49.655-16.916c-19.702,6.707-30.317,26.46-29.124,46.727c0.673,11.435,4.361,23.337,12.539,31.646c6.12,6.217,14.259,10.088,22.713,12.029c0.32,1.615,0.669,3.228,0.954,4.872c0.72,4.168,0.816,8.623,1.125,12.842c0.633,8.64,1.962,17.182,2.043,25.875C-5.293,7.783,9.62,7.897,9.62-1.767v-2c0-0.396-0.034-0.771-0.082-1.135c-0.312-7.617-1.405-15.141-1.961-22.74c-0.32-4.367-0.57-8.769-0.957-13.125c-0.229-2.567-1.006-5.031-1.526-7.544c13.473-0.236,26.292-6.224,33.876-18.298C49.209-82.913,45.124-104.222,34.021-118.9",
                    "#7c7c7c", 5, "trees5", 650, 700, grassgroup1);

                addTrees(svg,
                    "M38.118-85.701c-2.721-5.862-7.905-10.331-12.644-14.761c5.105-6.358,9.461-13.619,7.489-22.181c-1.397-6.064-6.534-11.825-12.496-14.504c4.446-6.749,6.958-14.372,5.304-22.802c-1.896-9.665-10.005-14.883-18.853-17.578c-9.831-2.996-22.901-3.013-31.89,2.406c-2.512,1.514-4.728,3.367-6.597,5.47c-4.098,3.88-6.842,9.494-7.891,15.06c-0.966,5.121-0.119,10.334,3.15,14.498c1.839,2.343,4.202,3.721,6.711,4.895c-5.89,4.656-9.31,13.045-10.071,20.09c-0.53,4.911,0.226,10.784,3.837,14.458c1.582,1.609,3.621,2.695,5.842,3.436c-4.198,4.613-6.742,11.343-7.997,17.006c-2.399,10.827,2.354,19.898,11.919,25.304c5.252,2.967,11.673,5.097,18.425,6.145C-7.98-38.425-8.598-28.098-8.507-17.748C-8.452-11.454-9.743,3.41-2.336,6.444c4.05,1.659,8.301-0.584,9.707-4.561C8.759-2.045,7.809-6.204,7.581-10.22C6.854-22.999,8.639-35.7,8.549-48.439c11.576-1.412,22.19-6.593,27.628-16.837C39.646-71.812,41.341-78.756,38.118-85.701z",
                    "#7c7c7c", 5, "trees5", 650, 1200, bushgroup1);

                addTrees(svg,
                    "M23.516-107.836c-0.113-14.006,0.663-28.567-1.99-42.385c-1.836-9.564-5.531-18.107-16.08-19.548c-1.237-0.169-2.486-0.206-3.729-0.148c-7.951-2.042-19.309-2.13-23.529,5.931c-1.751,3.344-2.061,6.88-2.116,10.531c-0.513,0.446-0.901,1.066-1.023,1.888c-1.831,12.298,0.353,23.966,0.503,36.229c0.006,0.458,0.013,0.916,0.019,1.372c-0.016,0.361-0.031,0.72-0.046,1.081c-0.125,3-0.006,6.012,0.19,9.023c0.129,8.956,0.219,17.908-0.028,26.865c-0.278,10.117-1.615,20.723,4.135,29.726c3.186,4.989,7.987,8.804,13.497,10.577c-0.29,7.506-0.661,15.011-0.595,22.531C-7.229-8.783-8.332,3.928-1.998,6.523c3.464,1.419,7.099-0.5,8.301-3.9c1.188-3.36,0.375-6.916,0.18-10.351c-0.557-9.804,0.614-19.571,0.806-29.33c0.393-0.18,0.782-0.361,1.151-0.571c3.328-0.966,6.603-2.419,8.978-4.46c7.1-6.099,8.167-18.325,8.255-27.004C25.805-82.028,23.623-94.884,23.516-107.836z",
                    "#7c7c7c", 5, "trees5", 650, 1000, treegroup1);

                clipGroup[3] = svg.append('g');
                rect = clipGroup[3].append('rect');
                rect.attr('class', 'hills4');
                rect.attr('width', 4435).attr('height', 1200);
                rect.attr('fill', '#bbbcb9');

                shape = clipGroup[3].append('path');
                shape.attr('d', 'M-245.178,1054.773c-4.177,10.086-6.46,21.057-6.46,32.589c0,6.4,0.835,12.937,2.393,19.401h7721.611c3.845-9.716,5.967-20.296,5.967-31.402c0-38.419-26.622-72.854-62.364-83.573c0.006-14.589-3.525-28.733-11.34-39.73c6.929-12.701,10.697-27.063,10.697-41.713c-1.036-7.709-2.072-15.419-3.107-23.128c-4.134-14.738-11.592-27.535-22.374-38.391c-19.321-24.719-43.872-43.878-68.674-62.777c-19.914-15.175-40.999-28.68-62.998-40.626c-49.119-26.673-103.165-45.979-158.227-55.665c-31.785-5.592-64.134-9.389-96.429-9.912c-32.233-0.521-64.22,3.337-96.017,8.335c-57.352,9.013-109.219,33.506-159.586,61.429c-22.009,12.201-43.332,25.546-63.264,40.935c-7.386,5.702-14.974,11.363-22.367,17.265c-5.887-4.492-11.768-8.949-17.809-13.014c-15.055-10.126-32.141-16.361-49.012-22.823c-15.389-5.895-31.119-10.85-47.15-14.661c-43.32-10.298-87.464-12.219-130.91-1.653c-18.363,4.465-36.672,12.493-51.758,23.965c-7.369,5.604-14.408,11.464-21.396,17.371c-9.477-6.31-19.281-12.139-29.195-17.724c-25.439-14.332-52.314-25.844-79.377-36.716c-47.793-19.199-97.8-28.887-148.883-34.276c-98.755-10.42-202.99,12.677-288.086,63.79c-27.742,16.664-53.802,37.005-77.559,58.921c-6.768,6.243-13.213,12.805-19.498,19.521c-6.682-2.929-13.37-5.849-20.113-8.679c-14.443-6.062-29.854-6.993-45.317-8.997c-27.322-3.541-56.74,1.293-83.521,5.46c-27.664,4.306-52.738,14.55-78.379,25.411c-1.181-1.102-2.363-2.2-3.564-3.287c-22.543-20.399-47.227-39.145-73.315-54.812c-25.895-15.551-54.052-27.589-82.299-38.083c-22.321-8.293-45.405-14.433-68.759-19.011c-50.746-9.949-102.675-13.966-154.324-14.974c-35.546-0.694-71.167,0.266-106.599,3.321c-44.612-22.248-92.77-38.487-141.74-47.102c-31.785-5.592-64.134-9.389-96.429-9.912c-32.233-0.521-64.22,3.337-96.017,8.335c-57.352,9.013-109.219,33.506-159.586,61.429c-22.009,12.201-43.332,25.546-63.264,40.935c-7.386,5.702-14.974,11.363-22.367,17.265c-5.887-4.492-11.768-8.949-17.809-13.014c-15.055-10.126-32.141-16.361-49.012-22.823c-15.389-5.895-31.119-10.85-47.15-14.661c-43.32-10.298-87.464-12.219-130.91-1.653c-18.363,4.465-36.672,12.493-51.758,23.965c-7.369,5.604-14.408,11.464-21.396,17.371c-9.477-6.31-19.281-12.139-29.195-17.724c-25.439-14.332-52.314-25.844-79.377-36.716c-47.793-19.199-97.8-28.887-148.883-34.276c-98.755-10.42-202.99,12.677-288.086,63.79c-27.742,16.664-53.802,37.005-77.559,58.921c-6.768,6.243-13.213,12.805-19.498,19.521c-6.682-2.929-13.37-5.849-20.113-8.679c-14.443-6.062-29.854-6.993-45.317-8.997c-27.322-3.541-56.74,1.293-83.521,5.46c-27.664,4.306-52.738,14.55-78.379,25.411c-1.181-1.102-2.363-2.2-3.564-3.287c-22.543-20.399-47.227-39.145-73.315-54.812c-25.895-15.551-54.052-27.589-82.299-38.083c-22.321-8.293-45.405-14.433-68.759-19.011c-50.746-9.949-102.675-13.966-154.324-14.974c-44.975-0.878-90.068,0.877-134.749,6.197c-51.239,6.102-102.423,14.247-151.06,32.063c-32.064,11.745-63.248,26.108-91.499,44.948c-12.143-10.81-25.063-20.794-38.061-30.698c-19.914-15.175-40.999-28.68-62.998-40.626c-49.119-26.673-103.165-45.979-158.227-55.665c-31.785-5.592-64.134-9.389-96.429-9.912c-32.233-0.521-64.22,3.337-96.017,8.335c-57.352,9.013-109.219,33.506-159.586,61.429c-22.009,12.201-43.332,25.546-63.264,40.935c-7.386,5.702-14.974,11.363-22.367,17.265c-5.887-4.492-11.768-8.949-17.809-13.014c-15.055-10.126-32.141-16.361-49.012-22.823c-15.389-5.895-31.119-10.85-47.15-14.661c-43.32-10.298-87.464-12.219-130.91-1.653c-18.363,4.465-36.672,12.493-51.758,23.965c-7.369,5.604-14.408,11.464-21.396,17.371c-9.477-6.31-19.281-12.139-29.195-17.724c-25.439-14.332-52.314-25.844-79.377-36.716c-47.793-19.199-97.8-28.887-148.883-34.276c-98.755-10.42-202.99,12.677-288.086,63.79c-27.742,16.664-53.802,37.005-77.559,58.921c-6.768,6.243-13.213,12.805-19.498,19.521c-6.682-2.929-13.37-5.849-20.113-8.679c-14.443-6.062-29.854-6.993-45.317-8.997c-27.322-3.541-56.74,1.293-83.521,5.46c-27.664,4.306-52.738,14.55-78.379,25.411c-1.181-1.102-2.363-2.2-3.564-3.287c-22.543-20.399-47.227-39.145-73.315-54.812c-25.895-15.551-54.051-27.589-82.299-38.083c-22.321-8.293-45.405-14.433-68.759-19.011c-50.746-9.949-102.675-13.966-154.325-14.974c-44.975-0.878-90.068,0.877-134.749,6.197c-51.24,6.102-102.422,14.247-151.06,32.063c-50.842,18.623-99.478,43.818-137.702,83.027c-2.008,2.06-3.892,4.201-5.661,6.408c-20.585,6.926-39.97,17.409-57.346,32.596c-28.585,24.983-33.176,74.008-13.604,105.429C-292.42,1025.504-270.442,1043.297-245.178,1054.773z');
                shape.attr('fill', '#bbbcb9');
                shape.attr('opacity', '.25');
                shape.attr('class', 'hills5');

                clipGroup[3].attr('data-from', 'M 0 650 c 100 0 200 0 300 0 c 100 0 400 0 500 0 c 100 0 200 0 300 0 c 100 0 200 0 300 0 c 100 0 400 0 500 0 c 100 0 200 0 300 0 c 100 0 200 0 300 0 c 100 0 400 0 500 0 c 100 0 200 0 300 0 c 100 0 200 0 300 0 c 100 0 200 0 300 0 c 100 0 400 0 500 0 c 100 0 200 0 300 0 c 100 0 200 0 300 0 c 100 0 200 0 300 0 l 100 465 l -6000 0');
                clipGroup[3].attr('data-to', 'M 0 650 c 100 -50 200 -50 300 0 c 100 -100 400 -100 500 0 c 100 -30 200 -30 300 0 c 100 -100 200 -100 300 0 c 100 -100 400 -100 500 0 c 100 -100 200 -100 300 0 c 100 -40 200 -40 300 0 c 100 -100 400 -100 500 0 c 100 -100 200 -100 300 0 c 100 -100 200 -100 300 0 c 100 -100 200 -100 300 0 c 100 -100 400 -100 500 0 c 100 -100 200 -100 300 0 c 100 -100 200 -100 300 0 c 100 -100 200 -100 300 0 l 100 465 l -6000 0');
                clipGroup[3].attr('clip-path', 'url(#clip4)');
                clips[3] = svg.append('clipPath').attr('id', 'clip4');
                paths[3] = clips[3].append('path').attr('d', clipGroup[3].attr('data-from'));

                parallaxGroupA = $('#parallaxA').find('.parallax-item');
                parallaxGroupB = $('#parallaxB').find('.parallax-item');
            }

            /**
             * animate svg hills to flat
             */
            function animateSVGFlat() {
                for (var i = 0; i < clipGroup.length; i += 1) {
                    paths[i].transition().duration(2000).attr('d', clipGroup[i].attr('data-from'));
                }

                //for (var i = 0; i < trees.length; i += 1) {
                //    trees[i].transition().duration(2000).attr('transform', trees[i].attr('data-from'));
                //}
            }

            /**
             * animate svg hills to curves
             */
            function animateSVGCurve() {
                for (var i = 0; i < clipGroup.length; i += 1) {
                    paths[i].transition().duration(2000).attr('d', clipGroup[i].attr('data-to'));
                }

                //for (var i = 0; i < trees.length; i += 1) {
                //    trees[i].transition().duration(2000).attr('transform', trees[i].attr('data-to'));
                //}
            }

            //function setupCanvas() {
            //    canvas = $('#groundA1')[0];
            //    ctx = canvas.getContext('2d');

            //    AssetModel.loadGroup(1, function () {
            //        setupImageList();
            //        draw();    
            //    });
            //}
          
//public
            instance.init = function () {
                var i = 0,
                    element;

                $body = $('body');
                $container = $('#layer1');
                $cloudsA = $('#cloudsA');
                $cloudsB = $('#cloudsB');
                $planet = $('#cube1');
                $leftside = $('#cube1 .left');
                $rightside = $('#cube1 .right');
                $backside = $('#cube1 .back2');
                $frontside = $('#cube1 .front');
                $frontside2 = $('#cube1 .front2');
                $bottomside = $('#cube1 .bottom');

                setupSVG();
            };

            /**
             * set parallax position without animating
             */
            instance.setParallax = function (goal) {
                if (VarsModel.DETAILS === true) {
                    delta = {x: goal};
                    parallax();
                }
            };

            /**
             * animate parallax elements
             */
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
                //if (moveclouds === true && VarsModel.DETAILS === true) {
                //    bgposition -= 1;
                //    if (rotated !== true) {
                //        $cloudsA.css({backgroundPosition: bgposition + 'px 150px'});
                //    } else {
                //        $cloudsB.css({backgroundPosition: bgposition + 'px 150px'});
                //    }
                //}
            };

//state methods

            /**
             * set values based on state
             */
            instance.setState = function (newState) {

                switch (newState) 
                {
                case "css":
                    $planet.show();
                    $body.removeClass('night');
                    $body.removeClass('dusk');
                    $body.removeClass('space');
                    $body.addClass('css');
                    instance.removeCurves();
                    instance.unrotate();
                    $leftside.hide();
                    $rightside.hide();
                    $backside.hide();
                    $bottomside.hide();
                    $frontside.show();                      
                    $frontside2.hide();
                    moveclouds = true;
                    break;
                case "svg":
                    $planet.show();
                    $body.removeClass('night');
                    $body.removeClass('dusk');
                    $body.removeClass('space');
                    $body.addClass('css');
                    instance.addCurves();
                    instance.unrotate();
                    $leftside.hide();
                    $rightside.hide();
                    $backside.hide();
                    $bottomside.hide();
                    $frontside.show();                      
                    $frontside2.hide();
                    moveclouds = true;
                    break;
                case "3d":
                    $planet.show();
                    $body.removeClass('night');
                    $body.removeClass('dusk');
                    $body.addClass('css');
                    $body.addClass('space');
                    instance.addCurves();
                    instance.unrotate();
                    $leftside.show();
                    $rightside.show();
                    $backside.show();
                    $bottomside.show();
                    $frontside2.show();
                    $frontside.hide();  //hide front
                    moveclouds = false;
                    break;
                case "canvas":
                    $planet.hide();
                    break;
                case "webgl":
                    $planet.show();
                    $body.removeClass('night');
                    $body.removeClass('dusk');
                    $body.addClass('css');
                    $body.addClass('space');
                    instance.addCurves();
                    instance.unrotate();
                    $frontside.hide();
                    $leftside.hide();
                    $rightside.hide();
                    $backside.hide();
                    $bottomside.hide();
                    moveclouds = false;
                    //instance.rotate();
                    break;
                case "blend":
                    $planet.show();
                    $body.removeClass('space');
                    $body.removeClass('dusk');
                    $body.addClass('css');
                    $body.addClass('night');
                    instance.rotate();
                    $leftside.hide();
                    $rightside.hide();
                    $bottomside.hide();
                    $backside.hide();
                    $frontside.hide();
                    $frontside2.hide();
                    moveclouds = true;
                    break;
                case "shader":
                    $planet.show();
                    $body.removeClass('space');
                    $body.removeClass('night');
                    $body.removeClass('css');
                    $body.addClass('dusk');
                    instance.rotate();  //this will set fornt and back
                    $leftside.hide();
                    $rightside.hide();
                    $backside.hide();
                    $bottomside.hide();
                    $frontside.hide();
                    $frontside2.hide();
                    moveclouds = true;
                    break;
                default:
                    instance.removeAll();
                    instance.unrotate();
                    $planet.show();
                    $frontside.show();                      
                    $frontside2.hide();
                    moveclouds = true;
                    break;
                }
            }

            instance.removeCurves = function () {
                if (curvy === true) {
                    animateSVGFlat();
                }

                curvy = false;
            };

            instance.addCurves = function () {
                
                if (curvy === false) {
                    animateSVGCurve();
                }

                curvy = true;
            };

            instance.rotate = function () {
                $('#cube1 .back').show();
                $frontside.hide();
                rotated = true;
            };

            instance.unrotate = function () {
                $frontside.show();
                $('#cube1 .back').hide();
                rotated = false;
            };

            instance.removeAll = function () {
                $body.removeClass('space');
                $body.removeClass('night');
                $body.removeClass('css');
                $body.removeClass('dusk');
                $leftside.hide();
                $rightside.hide();
                instance.removeCurves();
            };

		};

		return new Scenery();
    });
