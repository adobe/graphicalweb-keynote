//let's try something neat

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(void) 
{
	vec2 pos = (gl_FragCoord.xy - resolution * 0.5) / resolution.yy;

    vec3 rgb = vec3(1.0, 1.0 * pos.y, time * pos.x);
    float alpha = 1.0;
    gl_FragColor = vec4(rgb, alpha);
}
