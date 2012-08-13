/*
Copyright 2012 Adobe Systems, Incorporated
This work is licensed under a Creative Commons Attribution-Noncommercial-Share Alike 3.0 Unported License http://creativecommons.org/licenses/by-nc-sa/3.0/ .
Permissions beyond the scope of this license, pertaining to the examples of code included within this work are available at Adobe http://www.adobe.com/communities/guidelines/ccplus/commercialcode_plus_permission.html .
*/

precision mediump float;

attribute vec4 a_position;
attribute vec2 a_texCoord;
attribute vec2 a_meshCoord;

const float PI = 3.1415;
const int cols = 4;
const int rows = 4;
const int n = rows - 1;
const int m = cols - 1;
const vec2 u_meshSize = vec2(5.0, 5.0);
const vec4 u_meshBox = vec4(0.0, 0.0, 5.0, 5.0);

uniform mat4 u_projectionMatrix;
uniform mat4 transform;
uniform vec2 u_textureSize;
//uniform vec2 u_meshSize;
//uniform vec4 u_meshBox;
uniform float k[cols * rows * 3];
uniform float factor[cols > rows ? cols : rows];

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

float binomialCoefficient(int n, int i) {
    return factor[n] / (factor[i] * factor[n-i]);
}

float calculateB(int i, int n, float u) {
    float bc = binomialCoefficient(n, i);
    // Adding 0.000001 to avoid having pow(0, 0) which is undefined.
    return bc * pow(u + 0.000001, float(i)) * pow(1.0 - u + 0.00001, float(n - i));
}

vec3 calculate(float u, float v) {
    vec3 result = vec3(0.0);
    vec2 offset = vec2(u_meshBox.x + u_meshBox.z / 2.0, 
                       u_meshBox.y + u_meshBox.w / 2.0);
    
    for (int i = 0; i <= n; ++i) {
        for (int j = 0; j <= m; ++j) {
            float c = calculateB(i, n, u) * calculateB(j, m, v);
            int z = (j * rows + i) * 3;
            vec3 point = vec3(k[z] * u_meshBox.z + offset.x, k[z + 1] * u_meshBox.w + offset.y, k[z + 2]);
            result += c * point;
        }
    }
    return result;
}

void main()
{
    float curve = abs(cos(a_meshCoord.x * PI * 3.0));
    shadow = min(1.0, curve + 0.2);

    //vec4 pos = a_position;
    //pos.z = curve * 0.1;
    //gl_Position = u_projectionMatrix * perspective(0.9) * transform * pos;
    
    //v_texCoord = a_texCoord;
    //vec3 pos = calculate(a_meshCoord.x, a_meshCoord.y);
    //gl_Position = u_projectionMatrix * perspective(1000.0) * transform * vec4(pos, 1.0);
    
    vec3 pos = vec3(a_position.x, a_position.y, a_position.z);
    gl_Position = u_projectionMatrix * perspective(1000.0) * transform * vec4(pos, 1.0);
}
