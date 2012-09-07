
precision mediump float;

varying vec2 v_texCoord;
varying float shadow;
uniform float backface;

void main()
{
    css_BlendColor = vec4(shadow, shadow, shadow, 1.0);
}
