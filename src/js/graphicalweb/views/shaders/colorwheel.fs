//mod "Have you tried logarithms?" @scratchisthebes

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 hsv2rgb(float h,float s,float v) {
	return mix(vec3(1.),clamp((abs(fract(h+vec3(3.,2.,1.)/3.)*6.-3.)-1.),0.,1.),s)*v;
}


void main( void ) 
{
    float aspect = resolution.x/resolution.y;
    vec2 unipos = gl_FragCoord.xy / resolution;
    vec2 pos = unipos*2.0-1.0;
    pos.x *= aspect;
	
	//vec2 position = (gl_FragCoord.xy - resolution * 0.5) / resolution.yy;
	
	float lena = length(pos);
	float longest = sqrt(float(resolution.x*resolution.x) + float(resolution.y*resolution.y))*0.5;
	float dx = gl_FragCoord.x-resolution.x/2.0;
	float dy = 0.2+gl_FragCoord.y-resolution.y/2.0;
	float len = sqrt(dx*dx+dy*dy);
	float ds = len/longest;
	float md = time*0.4;
	
	float ang = 2.0*atan(dy,(len+dx));
	ang += log(len);
	
	float hue = (0.9 - sin(ang + md*32.0) * 0.43)*(1.0-ds);
	float sat = (0.1 - cos(ang + md*3.141592*2.0) * 0.99)*(1.0-ds);
	float lum = (0.9 + sin(ang  + md*3.141592*2.0) * 0.53)*(1.0-ds);
    	float alpha =  length(pos);

    	vec3 rgb = hsv2rgb(hue, sat, lum);
	vec3 clr = vec3(0.99, 0.66, 0.22);
	
	clr = mix( clr, rgb, alpha);
	gl_FragColor = vec4( clr,alpha );

}
