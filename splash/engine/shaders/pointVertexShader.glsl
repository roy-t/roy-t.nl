in float vVertexId;
out float vFragmentId;

uniform sampler2D uVertexPositionSampler;
uniform float uVertrexStride;
uniform float uPointSize;

void main(void) {
    gl_PointSize = uPointSize;

    vec2 uv = indexToTextureCoordinate(vVertexId, uVertrexStride);
    vec4 position = texture(uVertexPositionSampler, uv);
    float x = (position.x * 2.0) - 1.0;
    float y = (position.y * 2.0) - 1.0;
    gl_Position = vec4(x, y, 0, 1);
    vFragmentId = vVertexId;
}