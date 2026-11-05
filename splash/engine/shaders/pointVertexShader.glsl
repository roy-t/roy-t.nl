in float vVertexId;
flat out vec3 vColor;

uniform sampler2D uVertexPositionSampler;
uniform float uVertexStride;
uniform float uPointSize;

const vec3 colorA =  vec3(131.0, 1.0, 143.0);
const vec3 colorB =  vec3(201.0, 8.0, 200.0);
const vec3 colorC =  vec3(255.0, 49.0, 48.0);
const vec3 colorD =  vec3(245.0, 94.0, 0.0);
const vec3 colorE =  vec3(253.0, 176.0, 6.0);

void main(void) {
    gl_PointSize = uPointSize;

    vec4 position = texelFetch(uVertexPositionSampler, indexToTexel(vVertexId, uVertexStride), 0);
    float x = (position.x * 2.0) - 1.0;
    float y = (position.y * 2.0) - 1.0;
    gl_Position = vec4(x, y, 0, 1);

    // Pick the color once per particle, instead of once per fragment
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
    vColor = c / 255.0;
}
