//let's try something neat

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform float intensity;
uniform vec2 mouse;
uniform vec2 resolution;

//create method for blobs
float blob(float radius, vec2 center) {
    vec2 p = -1.0 + 2.0 * gl_FragCoord.xy / resolution.xy;
    float r = (dot(p-center, p-center)) * radius;
    float metaball = 1.0 / r; //inverse
    return metaball;
}

float mask(float radius, vec2 center) {
    vec2 p = -1.0 + 2.0 * gl_FragCoord.xy / resolution.xy;
    float r =(dot(p-center,p-center)) * radius;
    return r;
}

vec3 hsv2rgb(float h,float s,float v) {
	return mix(vec3(1.),clamp((abs(fract(h+vec3(3.,2.,1.)/3.)*6.-3.)-1.),0.,1.),s)*v;
}

void main(void) 
{
	vec2 pos = (gl_FragCoord.xy - resolution * 0.5) / resolution.yy;

    float alpha;
    float x = gl_FragCoord.x;
    float y = gl_FragCoord.y;
    float mov0 = x + y + cos(sin(time) * 2.) * 100. + sin(x / 100.) * 1000.;
    float mov1 = y / resolution.y / 0.2 + time * 10.0;
    float mov2 = x / resolution.x / 0.2;

    vec3 color;

    float c1 = 0.5;
    float c2 = 0.2 - abs(sin(c1 + sin(mov0 / 100. + time * 10.) + sin(y / 40. + time * 10.) + sin((x + y) / 100.) * 3.));
    float c3 = 0.5 - abs(sin(c2 + cos(mov1 + mov2 + c2) + cos(mov2) + sin(x / 1000.)));

    color.r = c1 * c2;
    color.r += .05 + sin(time) * .05;
    color.g = dot(c1, c2);
    color.b = c3 * c1;
    color.b += dot(c3, c2);
 
//blob 1
    color.r += blob(10.0 + sin(time) * 1.0, vec2(cos(time*.1)*0.4, sin(time*0.6)*0.4)) * .2;
    color.b += blob(10.0 + sin(time) * 1.0, vec2(cos(time*.1)*0.4, sin(time*0.6)*0.4)) * .2;
    color.r /= mask(7.0, vec2(cos(time*.1)*0.4, sin(time*0.6)*0.4));
    color.g /= mask(7.0, vec2(cos(time*.1)*0.4, sin(time*0.6)*0.4));
    color.b /= mask(7.0, vec2(cos(time*.1)*0.4, sin(time*0.6)*0.4));

//blob 2
    color.g += blob(8.0, vec2(cos(time*.2)*0.4, sin(time*1.5)*0.4));
    color.b += blob(8.0, vec2(cos(time*.2)*0.4, sin(time*1.5)*0.4));
    color.r /= mask(5.0, vec2(cos(time*.2)*0.4, sin(time*1.5)*0.4));
    color.g /= mask(5.0, vec2(cos(time*.2)*0.4, sin(time*1.5)*0.4));
    color.b /= mask(5.0, vec2(cos(time*.2)*0.4, sin(time*1.5)*0.4));

//blob 3
    color.g += blob(18.0, vec2(cos(time*.7)*0.4, sin(time*.2)*0.4));
    color.r += blob(18.0, vec2(cos(time*.7)*0.4, sin(time*.2)*0.4));
    color.r /= mask(15.0, vec2(cos(time*.7)*0.4, sin(time*.2)*0.4));
    color.g /= mask(15.0, vec2(cos(time*.7)*0.4, sin(time*.2)*0.4));
    color.b /= mask(15.0, vec2(cos(time*.7)*0.4, sin(time*.2)*0.4));

//blob 4
    color.r *= blob(20.0, vec2(cos(time*.3)*0.4, sin(time*0.2)*0.2));
    color.g *= blob(20.0, vec2(cos(time*.3)*0.4, sin(time*0.2)*0.2));
    color.b += blob(20.0, vec2(cos(time*.3)*0.4, sin(time*0.2)*0.2));
    color.r /= mask(10.0, vec2(cos(time*.3)*0.4, sin(time*0.2)*0.2));
    color.g /= mask(10.0, vec2(cos(time*.3)*0.4, sin(time*0.2)*0.2));
    color.b /= mask(10.0, vec2(cos(time*.3)*0.4, sin(time*0.2)*0.2));

    vec3 rgb = vec3(color.b, color.r, color.g);
	vec3 tint = vec3(0.29, 0.66, 0.82);

    rgb = mix(rgb, tint, 0.1 + sin(time) * 0.1);
    color = mix(color, rgb, 0.6 + cos(time) * 0.2);

    alpha = color.r * color.g * color.b;
    if (alpha > 1.0) {
        alpha = 1.0;
    }

   gl_FragColor = vec4(color * intensity, alpha);
}
