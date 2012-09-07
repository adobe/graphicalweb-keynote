
precision mediump float;

attribute vec4 a_position;
attribute vec2 a_texCoord;
attribute vec2 a_meshCoord;

uniform float delta;
uniform mat4 u_projectionMatrix;
uniform mat4 transform;

varying vec2 v_texCoord;
varying float shadow;

mat4 perspective(float p) {
    float perspective = - 1.0 / p;
    return mat4(
    1.0, 0.0, 0.0, 0.0, 
    0.0, 1.0, 0.0, 0.0, 
    0.0, 0.0, 1.0, perspective, 
    0.0, 0.0, 0.0, 1.0);
}

void main()
{
    vec4 pos = a_position;
    float curve = 0.0;

    float dist = distance(vec2(0.5, 0.5), a_meshCoord);
    curve = cos(delta + a_meshCoord.x * 2.0) * delta;
    curve -= sin(delta + a_meshCoord.y * 5.0) * delta;

    shadow = min(1.0, curve + 1.0);

    pos.z = curve * 0.1;
    gl_Position = u_projectionMatrix * perspective(0.9) * transform * pos;
}
