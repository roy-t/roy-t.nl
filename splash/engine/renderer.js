import { ShaderProgram } from "./shaderProgram.js";
import { DoubleBufferedFrameBuffer } from "./frameBuffer.js";
import { VertexBuffers } from "./vertexBuffers.js";

function render(
    /** @type {WebGL2RenderingContext} */
    gl,
    /** @type {number} */
    width,
    /** @type {number} */
    height,
    /** @type {ShaderProgram} */
    velocityProgram,
    /** @type {ShaderProgram} */
    positionProgram,
    /** @type {ShaderProgram} */
    renderProgram,
    /** @type {VertexBuffers} */
    buffers,
    /** @type {DoubleBufferedFrameBuffer} */
    positionBuffer,
    /** @type {DoubleBufferedFrameBuffer} */
    velocityBuffer,
    /** @type {number} */
    delta,
    /** @type {number} */
    accumulator,
    /** @type {number} */
    quality) {

    // Update velocity simulation
    simulate(gl, velocityBuffer, velocityProgram, velocityBuffer.readTarget.tex, positionBuffer.readTarget.tex,
        buffers, delta, accumulator);
    // Update position simulation
    simulate(gl, positionBuffer, positionProgram, velocityBuffer.readTarget.tex, positionBuffer.readTarget.tex,
        buffers, delta, accumulator);

    // Render points to canvas
    gl.useProgram(renderProgram.program);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, width, height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, positionBuffer.readTarget.tex);
    gl.uniform1i(renderProgram.getUniform("uVertexPositionSampler"), 0);
    gl.uniform1i(renderProgram.getUniform("uFragmentPositionSampler"), 0);

    gl.uniform1f(renderProgram.getUniform("uVertrexStride"), positionBuffer.readTarget.width);
    gl.uniform1f(renderProgram.getUniform("uFragmentStride"), positionBuffer.readTarget.width);

    // Total coverage always stays 4M pixels, but with a lot less work!

    // 2x2, 4x4, 8x8, ...
    const mul = Math.ceil(width / 1440.0);
    const div = Math.floor(Math.pow(2, quality));
    let pointSize = mul * div;


    // 1024*1024, 512*512, 256*256, ...
    let pointCount = Math.floor((buffers.pointCount * 2)  / div);

    
    gl.uniform1f(renderProgram.getUniform("uPointSize"), pointSize);

    drawPoints(gl, renderProgram, buffers, pointCount);
}

function simulate(
    /** @type {WebGL2RenderingContext} */
    gl,
    /** @type {DoubleBufferedFrameBuffer} */
    buffer,
    /** @type {ShaderProgram} */
    program,
    /** @type {WebGLTexture} */
    velocityTexture,
    /** @type {WebGLTexture} */
    positionTexture,
    /** @type {VertexBuffers} */
    buffers,
    /** @type {number} */
    delta,
    /** @type {number} */
    accumulator,
) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, buffer.writeTarget.fb);
    gl.viewport(0, 0, buffer.writeTarget.width, buffer.writeTarget.height);
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(program.program);

    gl.uniform1f(program.getUniform("uDelta"), delta);
    gl.uniform1f(program.getUniform("uAccumulator"), accumulator);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, positionTexture);
    gl.uniform1i(program.getUniform("uPositionSampler"), 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, velocityTexture);
    gl.uniform1i(program.getUniform("uVelocitySampler"), 1);

    drawQuad(gl, program, buffers);
}

function drawQuad(
    /** @type {WebGL2RenderingContext} */
    gl,
    /** @type {ShaderProgram} */
    program,
    /** @type {VertexBuffers} */
    buffers) {

    program.setVertexAttribute(gl, buffers.quad, "aVertexPosition", 2, gl.FLOAT);

    {
        const offset = 0;
        const vertexCount = 4;
        gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
    }
}

function drawPoints(
    /** @type {WebGL2RenderingContext} */
    gl,
    /** @type {ShaderProgram} */
    program,
    /** @type {VertexBuffers} */
    buffers,
    /** @type {number} */
    pointCount
    ) {

    program.setVertexAttribute(gl, buffers.points, "Id", 1, gl.FLOAT);

    {
        gl.drawArrays(gl.POINTS, 0, Math.min(buffers.pointCount, pointCount));
    }
}

export { render };
