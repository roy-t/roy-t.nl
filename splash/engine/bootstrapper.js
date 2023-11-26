import { VertexBuffers } from "./vertexBuffers.js";
import { render } from "./renderer.js";
import { DoubleBufferedFrameBuffer, FrameBuffer } from "./frameBuffer.js";
import { ShaderProgram } from "./shaderProgram.js";

await main();

function throttle(f, delay) {
    let timer = 0;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => f.apply(this, args), delay);
    }
}

function resize(/** @type {HTMLCanvasElement} */ canvas) {
    canvas.width = Math.round(canvas.clientWidth * devicePixelRatio);
    canvas.height = Math.round(canvas.clientHeight * devicePixelRatio);
}

function disableSimulation() {
    document.querySelector("#quality").innerHTML = 'Simulation unavailable, try a browser that supports WebGL!';
    document.querySelector("#quality_ultra").remove();
    document.querySelector("#quality_high").remove();
    document.querySelector("#quality_medium").remove();
    document.querySelector("#quality_low").remove();
}

async function main() {
    /** @type {HTMLCanvasElement} */
    const canvas = document.querySelector("#glcanvas");
    let gl = canvas.getContext("webgl2");
    if (!gl) {
        console.error("Unable to initialize WebGl2 Context. Your browser or machine may not support it.");
        disableSimulation();
        return;
    }

    const ext = gl.getExtension("EXT_COLOR_BUFFER_FLOAT");
    if (!ext) {
        console.error("Unable to enable the EXT_COLOR_BUFFER_FLOAT extension. Your browser or machine may not support it.");
        disableSimulation();
        return;
    }

    // If the canvas resizes, the rendered bitmap will just be stretched. Instead we want
    // to resize the webgl viewport and frame buffers to create a pixel perfect image.
    const resizeObserver = new ResizeObserver(throttle((_) => {
        resize(canvas);
    }, 600));
    resize(canvas);

    resizeObserver.observe(canvas);

    const velocityProgram = await ShaderProgram.create(gl,
        'splash/engine/shaders/vertexShader.glsl',
        'splash/engine/shaders/velocityShader.glsl',
        ["aVertexPosition"],
        ["uDelta", "uAccumulator", "uPositionSampler", "uVelocitySampler"],
        ["splash/engine/shaders/common.glsl"]);

    const positionProgram = await ShaderProgram.create(gl,
        'splash/engine/shaders/vertexShader.glsl',
        'splash/engine/shaders/positionShader.glsl',
        ["aVertexPosition"],
        ["uDelta", "uAccumulator", "uPositionSampler", "uVelocitySampler"],
        ["splash/engine/shaders/common.glsl"]);

    const renderProgram = await ShaderProgram.create(gl,
        'splash/engine/shaders/pointVertexShader.glsl',
        'splash/engine/shaders/pointFragmentShader.glsl',
        [],
        ["uVertrexStride", "uFragmentStride", "uVertexPositionSampler", "uFragmentPositionSampler", "uPointSize"],
        ["splash/engine/shaders/common.glsl"]);


    if( velocityProgram === null || positionProgram === null || renderProgram === null) {
        console.error("Unable to initialize shaders. Check the logs for more errors.");
        disableSimulation();
        return;
    }

    let quality = 1;
    document.getElementById("quality_ultra").onclick = function () { quality = 1.0; }
    document.getElementById("quality_high").onclick = function () { quality = 2.0; }
    document.getElementById("quality_medium").onclick = function () { quality = 3.0; }
    document.getElementById("quality_low").onclick = function () { quality = 4.0; }

    let [positionBuffer, velocityBuffer] = createBuffers(gl, quality);
    const buffers = new VertexBuffers(gl, 1024 * 1024);

    let then = 0.0;
    let totalSeconds = 0.0;
    let currentQuality = quality;
    function frame(/** @type {DOMHighResTimeStamp} */ now) {
        if (document.visibilityState === "visible") {
            const deltaSeconds = Math.min((now - then) * 0.001, 1.0 / 30.0);
            if (currentQuality != quality) {
                [positionBuffer, velocityBuffer] = createBuffers(gl, quality);
                currentQuality = quality;
                totalSeconds = 0.0;
            }
            totalSeconds += deltaSeconds;
            then = now;

            render(gl, canvas.width, canvas.height, velocityProgram, positionProgram, renderProgram, buffers, positionBuffer, velocityBuffer, deltaSeconds, totalSeconds, currentQuality);
            positionBuffer.swap();
            velocityBuffer.swap();
        }

        requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
}

/** @type {DoubleBufferedFrameBuffer[2]} */
function createBuffers(
    /** @type {WebGL2RenderingContext} */gl,
    /** @type {number} */ quality) {

    const div = Math.pow(2, quality);

    const width = Math.floor(1024.0 / div);
    const height = Math.floor(1024.0 / div);

    const positionBuffer = new DoubleBufferedFrameBuffer(
        FrameBuffer.createRGBA32F(gl, width, height),
        FrameBuffer.createRGBA32F(gl, width, height)
    );
    const velocityBuffer = new DoubleBufferedFrameBuffer(
        FrameBuffer.createRGBA32F(gl, width, height),
        FrameBuffer.createRGBA32F(gl, width, height)
    );

    return [positionBuffer, velocityBuffer];
}