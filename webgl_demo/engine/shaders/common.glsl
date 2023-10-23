#version 300 es

#ifndef COMMON_GLSL
#define COMMON_GLSL

precision highp float;
precision mediump int;
precision highp sampler2D;

// Maps an index to the correct texel in a texture with the given stride (width)
vec2 indexToTextureCoordinate(float i, float stride) {
    float ix = mod(i, stride);
    float iy = i / stride;
    float u = ix / stride;
    float v = iy / stride;

    return vec2(u, v);
}

vec2 screenToTexture(vec2 tex) {
    return vec2((tex.x + 1.0f) / 2.0f, (tex.y + 1.0f) / 2.0f);
}

#define PI 3.1415926538
float easeInOutElastic(float x) {
    const float c5 = (2.0f * PI) / 4.5f;
    if(x <= 0.0f) {
        return 0.0f;
    } else if(x >= 1.0f) {
        return 1.0f;
    } else if(x < 0.5f) {
        return -(pow(2.0f, 20.0f * x - 10.0f) * sin((20.0f * x - 11.125f) * c5)) / 2.0f;
    } else {
        return (pow(2.0f, -20.0f * x + 10.0f) * sin((20.0f * x - 11.125f) * c5)) / 2.0f + 1.0f;
    }
}

// Random function, produces a number in [0...1)
float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898f, 78.233f))) * 43758.5453f);
}

vec4 mod289(vec4 x) {
    return x - floor(x * (1.0f / 289.0f)) * 289.0f;
}

float mod289(float x) {
    return x - floor(x * (1.0f / 289.0f)) * 289.0f;
}

vec4 permute(vec4 x) {
    return mod289(((x * 34.0f) + 1.0f) * x);
}

float permute(float x) {
    return mod289(((x * 34.0f) + 1.0f) * x);
}

vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159f - 0.85373472095314f * r;
}

float taylorInvSqrt(float r) {
    return 1.79284291400159f - 0.85373472095314f * r;
}

vec4 grad4(float j, vec4 ip) {
    const vec4 ones = vec4(1.0f, 1.0f, 1.0f, -1.0f);
    vec4 p, s;

    p.xyz = floor(fract(vec3(j) * ip.xyz) * 7.0f) * ip.z - 1.0f;
    p.w = 1.5f - dot(abs(p.xyz), ones.xyz);
    s = vec4(lessThan(p, vec4(0.0f)));
    p.xyz = p.xyz + (s.xyz * 2.0f - 1.0f) * s.www;

    return p;
}

// (sqrt(5) - 1)/4 = F4, used once below
#define F4 0.309016994374947451

float snoise(vec4 v) {
    const vec4 C = vec4(0.138196601125011f,  // (5 - sqrt(5))/20  G4
    0.276393202250021f,  // 2 * G4
    0.414589803375032f,  // 3 * G4
    -0.447213595499958f); // -1 + 4 * G4

    // First corner
    vec4 i = floor(v + dot(v, vec4(F4)));
    vec4 x0 = v - i + dot(i, C.xxxx);

    // Other corners

    // Rank sorting originally contributed by Bill Licea-Kane, AMD (formerly ATI)
    vec4 i0;
    vec3 isX = step(x0.yzw, x0.xxx);
    vec3 isYZ = step(x0.zww, x0.yyz);
    //  i0.x = dot( isX, vec3( 1.0 ) );
    i0.x = isX.x + isX.y + isX.z;
    i0.yzw = 1.0f - isX;
    //  i0.y += dot( isYZ.xy, vec2( 1.0 ) );
    i0.y += isYZ.x + isYZ.y;
    i0.zw += 1.0f - isYZ.xy;
    i0.z += isYZ.z;
    i0.w += 1.0f - isYZ.z;

    // i0 now contains the unique values 0,1,2,3 in each channel
    vec4 i3 = clamp(i0, 0.0f, 1.0f);
    vec4 i2 = clamp(i0 - 1.0f, 0.0f, 1.0f);
    vec4 i1 = clamp(i0 - 2.0f, 0.0f, 1.0f);

    //  x0 = x0 - 0.0 + 0.0 * C.xxxx
    //  x1 = x0 - i1  + 1.0 * C.xxxx
    //  x2 = x0 - i2  + 2.0 * C.xxxx
    //  x3 = x0 - i3  + 3.0 * C.xxxx
    //  x4 = x0 - 1.0 + 4.0 * C.xxxx
    vec4 x1 = x0 - i1 + C.xxxx;
    vec4 x2 = x0 - i2 + C.yyyy;
    vec4 x3 = x0 - i3 + C.zzzz;
    vec4 x4 = x0 + C.wwww;

    // Permutations
    i = mod289(i);
    float j0 = permute(permute(permute(permute(i.w) + i.z) + i.y) + i.x);
    vec4 j1 = permute(permute(permute(permute(i.w + vec4(i1.w, i2.w, i3.w, 1.0f)) + i.z + vec4(i1.z, i2.z, i3.z, 1.0f)) + i.y + vec4(i1.y, i2.y, i3.y, 1.0f)) + i.x + vec4(i1.x, i2.x, i3.x, 1.0f));

    // Gradients: 7x7x6 points over a cube, mapped onto a 4-cross polytope
    // 7*7*6 = 294, which is close to the ring size 17*17 = 289.
    vec4 ip = vec4(1.0f / 294.0f, 1.0f / 49.0f, 1.0f / 7.0f, 0.0f);

    vec4 p0 = grad4(j0, ip);
    vec4 p1 = grad4(j1.x, ip);
    vec4 p2 = grad4(j1.y, ip);
    vec4 p3 = grad4(j1.z, ip);
    vec4 p4 = grad4(j1.w, ip);

    // Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    p4 *= taylorInvSqrt(dot(p4, p4));

    // Mix contributions from the five corners
    vec3 m0 = max(0.6f - vec3(dot(x0, x0), dot(x1, x1), dot(x2, x2)), 0.0f);
    vec2 m1 = max(0.6f - vec2(dot(x3, x3), dot(x4, x4)), 0.0f);
    m0 = m0 * m0;
    m1 = m1 * m1;
    return 49.0f * (dot(m0 * m0, vec3(dot(p0, x0), dot(p1, x1), dot(p2, x2))) + dot(m1 * m1, vec2(dot(p3, x3), dot(p4, x4))));
}

#endif