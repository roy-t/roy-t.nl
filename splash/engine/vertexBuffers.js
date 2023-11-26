class VertexBuffers {
  quad;
  points;
  pointCount;

  constructor(/** @type {WebGL2RenderingContext}  */ gl, /** @type {number} */ points) {
    this.quad = VertexBuffers.#initQuadBuffer(gl);
    this.points = VertexBuffers.#initPointsBuffer(gl, points);
    this.pointCount = points;
  }

  static #initPointsBuffer(/** @type {WebGL2RenderingContext}  */ gl, /** @type {number} */ points) {
    const ids = new Float32Array(points);
    for (let i = 0; i < points; i++) {
      ids[i] = i;
    }

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, ids, gl.STATIC_DRAW);

    return buffer;
  }

  static #initQuadBuffer(/** @type {WebGL2RenderingContext}  */ gl) {
    const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    return positionBuffer;
  }
}

export { VertexBuffers };