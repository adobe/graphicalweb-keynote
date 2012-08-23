
precision mediump float;

varying vec2 v_texCoord;
varying float shadow;
uniform float backface;

void main()
{
	if (gl_FrontFacing && backface == 1.0)
		discard;

	if (!gl_FrontFacing && backface == 0.0)
		discard;

    css_BlendColor = vec4(1.0, 1.0, 1.0, 1.0);
}
