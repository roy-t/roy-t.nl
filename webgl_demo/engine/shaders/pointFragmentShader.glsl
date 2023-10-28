in float vFragmentId;
out vec4 fragColor;

uniform sampler2D uFragmentPositionSampler;
uniform float uFragmentStride;

const vec3 colorA =  vec3(131.0, 1.0, 143.0);
const vec3 colorB =  vec3(201.0, 8.0, 200.0);
const vec3 colorC =  vec3(255.0, 49.0, 48.0);
const vec3 colorD =  vec3(245.0, 94.0, 0.0);
const vec3 colorE =  vec3(253.0, 176.0, 6.0);

void main(void) {
    vec2 uv = indexToTextureCoordinate(vFragmentId, uFragmentStride);
    vec4 position = texture(uFragmentPositionSampler, uv);
    
    vec3 c;

    if(position.z > 0.8) {
        c = colorA;
    } else if (position.z > 0.6) {
        c = colorB;
    } else if (position.z > 0.4) {
        c = colorC;
    } else if (position.z > 0.2) {
        c = colorD;
    } else  {
        c = colorE;
    }
    fragColor = vec4(c / 255.0, 1.0);
}