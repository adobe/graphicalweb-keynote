//let's try something neat

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D tex0;
uniform sampler2D tex1;

//create method for blobs
float blob(float radius, vec2 center) {
    vec2 p = -1.0 + 2.0 * gl_FragCoord.xy / resolution.xy;
    float r =(dot(p-center,p-center)) * radius;
    float metaball = 1.0 / r; //inverse
    return metaball;
}

void main(void) 
{
	vec2 pos = (gl_FragCoord.xy - resolution * 0.5) / resolution.yy;

    /*
    vec3 rgb = vec3(1.0, 1.0 * pos.y, time * pos.x);
    float alpha = 1.0;
    gl_FragColor = vec4(rgb, alpha);
    */

   float x = gl_FragCoord.x;
   float y = gl_FragCoord.y;
   float mov0 = x + y + cos(sin(time) * 2.) * 100. + sin(x / 100.) * 1000.;
   float mov1 = y / resolution.y / 0.2 + time;
   float mov2 = x / resolution.x / 0.2;

   /*
    float c1 = abs(sin(mov1 + time) / 2. + mov2 / 2. - mov1 - mov2 + time);
    float c2 = abs(sin(c1 + sin(mov0 / 1000. + time) + sin(y / 40. + time) + sin((x + y) / 100.) * 3.));
    */

    vec3 color;

   float c1 = 0.5;
   float c2 = 0.2 - abs(sin(c1 + sin(mov0 / 100. + time) + sin(y / 40. + time) + sin((x + y) / 100.) * 3.));
   float c3 = 0.5 - abs(sin(c2 + cos(mov1 + mov2 + c2) + cos(mov2) + sin(x / 1000.)));

    color.r = c1 * c2;
    color.r += .05 + sin(time) * .05;
    color.g = dot(c1, c2);
    color.b = c3 * c1;
    color.b += dot(c3, c2);
 
    color.r += blob(8.0, vec2(cos(time*2.0)*0.4, sin(time*3.0)*0.4)) * sin(time);
    color.b += blob(8.0, vec2(cos(time*2.0)*0.4, sin(time*3.0)*0.4));
    color.b += blob(16.0, vec2(cos(time)*0.4, sin(time*1.5)*0.4));
    color.g += blob(16.0, vec2(cos(time)*0.4, sin(time*1.5)*0.4));

   gl_FragColor = vec4(color, 1.0);
}
