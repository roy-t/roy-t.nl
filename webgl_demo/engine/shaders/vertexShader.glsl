in vec4 aVertexPosition;
out vec2 vPosition;

void main(void) {
    gl_Position = aVertexPosition;
    vPosition = vec2(gl_Position.x, gl_Position.y);
}