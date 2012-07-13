<!DOCTYPE html>
<!--[if lt IE 7]> <html class="no-js lt-ie9 lt-ie8 lt-ie7" lang="en"> <![endif]-->
<!--[if IE 7]>    <html class="no-js lt-ie9 lt-ie8" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js lt-ie9" lang="en"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang="en"> <!--<![endif]-->

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <!-- <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"> -->
    <link rel="apple-touch-icon-precomposed" sizes="114x114" href="img/icons/apple-touch-icon-114x114-precomposed.png"/>  
    <link rel="apple-touch-icon-precomposed" sizes="72x72" href="img/icons/apple-touch-icon-72x72-precomposed.png"/>  
    <link rel="apple-touch-icon-precomposed" sizes="57x57" href="img/icons/apple-touch-icon-57x57-precomposed.png"/>  
    <link rel="apple-touch-icon-precomposed" href="img/icons/apple-touch-icon-precomposed.png"/>  
    
    <title>The Quest for The Graphical Web</title>
    <link href="css/MyFontsWebfontsKit.css" rel="stylesheet" type="text/css" />
    <link href="css/screen.css" media="screen, projection" rel="stylesheet" type="text/css" />
    <link href="css/print.css" media="print" rel="stylesheet" type="text/css" />
    <!--[if IE]>
    <link href="css/ie.css" media="screen, projection" rel="stylesheet" type="text/css" />
    <![endif]-->

    <script src="js/lib/dat.gui.min.js"></script>    
    <script src="js/lib/modernizr-2.5.3.min.js"></script>
</head>
<body>

    <header>
        <div id="logoHolder">
            <svg class="logo" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="42.318px" height="43.834px" viewBox="0 0 42.318 43.834" enable-background="new 0 0 42.318 43.834" xml:space="preserve">
                <g>
                    <ellipse transform="matrix(-0.4storyboard2.ai916 -0.8708 0.8708 -0.4916 21.6069 54.9044)" fill="#D5D5D5" cx="26.832" cy="21.145" rx="1.366" ry="1.871"/>
                    <path fill="#D5D5D5" d="M21.171,0.64c-11.683,0-21.149,9.47-21.149,21.149c0,11.682,9.467,21.15,21.149,21.15 c11.679,0,21.147-9.469,21.147-21.15C42.318,10.109,32.85,0.64,21.171,0.64z M35.104,23.764c-1.523,3.053-4.218,5.907-7.801,7.931 c-7.663,4.323-16.488,3.196-19.712-2.517c-3.224-5.715,0.374-13.854,8.037-18.176c5.7-3.215,12.047-3.414,16.25-0.952 c1.094,0.704,2.306,1.885,2.014,3.608c-0.295,1.737-1.294,1.135-3.529,1.86c-2.233,0.726-1.302,2.262-0.648,2.825 c0.655,0.564,4.15,1.668,5.226,2.999C35.523,22.066,35.492,22.793,35.104,23.764z"/>
                </g>
            </svg>
            <h2><small>the</small><br/>graphical web</h2>
        </div>
        <nav>
            <canvas id="one" class="char-btn" data-image="img/button/css.png" data-bg="#ffffff" width="100" height="100"></canvas>
            <canvas id="two" class="char-btn" data-image="img/button/svg.png" data-bg="#ffffff" width="100" height="100"></canvas>
            <canvas id="three" class="char-btn" data-image="img/button/transforms.png" data-bg="#ffffff" width="100" height="100"></canvas>
            <canvas id="four" class="char-btn" data-image="img/button/canvas.png" data-bg="#001A21" width="100" height="100"></canvas>
            <canvas id="five" class="char-btn" data-image="img/button/webgl.png" data-bg="img/button/webglBG.png" width="100" height="100"></canvas>
            <canvas id="six" class="char-btn" data-image="img/button/blend.png" data-bg="#001A21" width="100" height="100"></canvas>
            <canvas id="seven" class="char-btn" data-image="img/button/css.png" data-bg="#ffffff" width="100" height="100"></canvas>
        </nav>
    </header>

    <div id="preloader">
        <div class="spinner"></div>
    </div>

    <div id="cover"></div>

    <div id="main">
        <section id="introView">
            <h1>
                <small>The Quest for</small><br/>
                The Graphical Web
            </h1>
            <p id="startCopy">Click to Start</p>
            <div id="introBg"></div>
        </section>

        <!-- begin camera and scene internals -->
        <div id="camera">
            <div id="scene">
                <div id="background">

                    <div id="planet1" class="planet">
                        <div id="cube1" class="cube-layer">
                            <div class="front side plane">
                                <?php 
                                    //NOTE: webkit bug requires svg to be placed at document load in order to use SVG ANIMATIONS 
                                    include 'img/svg/background_animate.svg'; ?>

                                <div id="charCSS" class="character"></div>

                                <div id="charSVG" class="character"></div>

                            </div>
                            <div class="left side plane"></div>
                            <div class="right side plane"></div>
                            <div class="back side plane"></div>
                            <div class="bottom plane"></div>
                        </div> <!-- / cube -->
                    </div><!-- / planet1 -->

                </div><!-- / background -->
                
                <div id="charTransform" class="character"></div>
                <div id="charDIV" class="character"></div>

                <!-- TODO: move some of these outside of camera? -->
                <section id="section1">
                    <blockquote>This isn't very interesting</blockquote>
                    <blockquote>I wish this was more visually engaging...</blockquote>
                </section>

                <section id="section2">
                    <blockquote>This isn't very interesting</blockquote>
                    <blockquote>I wish this was more visually engaging...</blockquote>
                </section>

                <section id="section3">
                    <blockquote>This isn't very interesting</blockquote>
                    <blockquote>I wish this was more visually engaging...</blockquote>
                </section>                                 

                <section id="section4">
                    <blockquote>This isn't very interesting</blockquote>
                    <blockquote>I wish this was more visually engaging...</blockquote>
                </section>

            </div><!-- / scene -->
        </div><!-- / camera -->

        <canvas id="charCanvas" width="1000px" height="800px"></canvas>

    </div><!-- / main -->

    <!-- js -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
    <script>window.jQuery || document.write('<script src="js/lib/jquery-1.7.2.min.js"><\/script>')</script>
    <script src="js/lib/jquery.history.js"></script>
    <script src="js/lib/processing-1.3.6.min.js"></script>
    <script src="js/lib/RequestAnimationFrame.js"></script>
    <script src="js/lib/Tween.js"></script>
    <script src="js/lib/signals.min.js"></script>
    <script src="js/lib/require.js" data-main="js/main"></script>

    <script>
        
    </script>


</body>
</html>
