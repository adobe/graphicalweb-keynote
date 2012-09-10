#ifdef GL_ES
precision highp float;
#endif

uniform float delta;
uniform float alpha;

varying vec2 vUv;        

void main(void)
{
	vec2 position = vUv;

    float red = cos(delta * 0.1) * 0.5;
    float green = cos(delta * 0.02) * 0.5;
    float blue = 0.5 + cos(delta * 0.03) * 0.25;

    vec3 rgb = vec3(red, green, blue);
    vec4 color = vec4(rgb, alpha);
    
	gl_FragColor = color;
}

