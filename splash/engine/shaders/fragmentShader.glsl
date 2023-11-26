in vec2 vPosition;
out vec4 fragColor;
void main(void) {
    float u = (vPosition.x + 1.0) / 2.0;
    float v = (vPosition.y + 1.0) / 2.0;
    fragColor = vec4(u, v, 0, 1);
}