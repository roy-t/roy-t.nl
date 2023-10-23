import { VertexBuffers } from "./vertexBuffers.js";
import { drawScene } from "../draw-scene.js";
import { DoubleBufferedFrameBuffer, FrameBuffer } from "./frameBuffer.js";
import { ShaderProgram } from "./shaderProgram.js";

await main();

async function main() {
    /** @type {HTMLCanvasElement} */
    const canvas = document.querySelector("#glcanvas");
    let gl = canvas.getContext("webgl2");
    assertNotNull(gl, "Unable to initialize WebGl2 Context. Your browser or machine may not support it.");

    // TODO: remove debug tools
    //gl = WebGLDebugUtils.makeDebugContext(gl);
    const ext = gl.getExtension("EXT_COLOR_BUFFER_FLOAT");
    assertNotNull(ext, "Unable to enable the EXT_COLOR_BUFFER_FLOAT extension. Your browser or machine may not support it.")

    // If the canvas resizes, the rendered bitmap will just be stretched. Instead we want
    // to resize the webgl viewport and frame buffers to create a pixel perfect image.
    const resizeObserver = new ResizeObserver(() => {
        canvas.width = Math.round(canvas.clientWidth * devicePixelRatio);
        canvas.height = Math.round(canvas.clientHeight * devicePixelRatio);
        document.getElementById("hud").innerHTML = `Resolution: ${canvas.width}x${canvas.height}`;
    });
    resizeObserver.observe(canvas);

    const velocityProgram = await ShaderProgram.create(gl,
        'engine/shaders/vertexShader.glsl',
        'engine/shaders/velocityShader.glsl',
        ["aVertexPosition"],
        ["uDelta", "uAccumulator", "uPositionSampler", "uVelocitySampler"],
        ["engine/shaders/common.glsl"]);

    const positionProgram = await ShaderProgram.create(gl,
        'engine/shaders/vertexShader.glsl',
        'engine/shaders/positionShader.glsl',
        ["aVertexPosition"],
        ["uDelta", "uAccumulator", "uPositionSampler", "uVelocitySampler"],
        ["engine/shaders/common.glsl"]);

    const renderProgram = await ShaderProgram.create(gl,
        'engine/shaders/pointVertexShader.glsl',
        'engine/shaders/pointFragmentShader.glsl',
        [],
        ["uVertrexStride", "uFragmentStride", "uVertexPositionSampler", "uFragmentPositionSampler"],
        ["engine/shaders/common.glsl"]);

    const width = 1024;
    const height = 1024;

    const positionBuffer = new DoubleBufferedFrameBuffer(
        FrameBuffer.createRGBA32F(gl, width, height),
        FrameBuffer.createRGBA32F(gl, width, height)
    );
    const velocityBuffer = new DoubleBufferedFrameBuffer(
        FrameBuffer.createRGBA32F(gl, width, height),
        FrameBuffer.createRGBA32F(gl, width, height)
    );

    const buffers = new VertexBuffers(gl, width * height);

    let then = 0;
    let accumulator = 0;
    function render(now) {
        now *= 0.001; // convert to seconds
        const delta = Math.min(now - then, 1.0 / 30.0); // prevent stutters from greatly affecting the simulation
        accumulator += delta;
        then = now;

        drawScene(gl, canvas.width, canvas.height, velocityProgram, positionProgram, renderProgram, buffers, positionBuffer, velocityBuffer, delta, accumulator);
        positionBuffer.swap();
        velocityBuffer.swap();

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

function assertNotNull(/** @type {any} */ object, /** @type {string} */ message) {
    if (object === null) {
        console.error(message);
    }
}