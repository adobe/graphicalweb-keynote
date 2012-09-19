
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
    float ripple = 0.0;
    float curve = 0.0;

    //rippled edges
    ripple = -0.2 + sin(delta + a_meshCoord.y * 5.0);
    ripple += -0.2 + cos(delta + a_meshCoord.x * 5.0);

    //add hump to middle
    float dist = distance(vec2(0.5, 0.5), a_meshCoord);
    curve = cos(dist * 9.0) * 0.5;
    
    //only apply ripple to outer edge
    if (dist > 0.25) {
      curve += ripple * (dist - 0.25);
    }

    shadow = min(1.0, curve + 1.0);

    pos.z = curve * 0.1;

    gl_Position = u_projectionMatrix * perspective(1000.0) * transform * pos;
}
