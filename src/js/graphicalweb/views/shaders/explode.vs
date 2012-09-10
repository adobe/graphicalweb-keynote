varying vec2 vUv;
uniform float delta;
uniform float scale;
uniform float alpha;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main()
{
    vUv = uv;
    
    vec3 p = position;
    p.z += sin(1.0 * p.y + delta) * 1.0;
    p.z += cos(1.0 * p.z + delta / 2.0) * 1.0;
    p.z += cos(1.0 * p.x + delta) * 1.0;
    p.x += sin(p.y + delta / 2.0) * 1.0;
    
    vec4 mvPosition = modelViewMatrix * vec4(scale * p, 1.0 );
    gl_Position = projectionMatrix * mvPosition;
}
