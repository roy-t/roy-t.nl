class DoubleBufferedFrameBuffer {

    /** @type {FrameBuffer[]} */
    #buffers
    /** @type {number} */
    #writeIndex
    /** @type {number} */
    #readIndex

    constructor(
        /** @type {FrameBuffer} */
        write,
        /** @type {FrameBuffer} */
        read) {

        this.#buffers = [write, read];
        this.#writeIndex = 0;
        this.#readIndex = 1;
    }

    get readTarget() {
        return this.#buffers[this.#readIndex];
    }

    get writeTarget() {
        return this.#buffers[this.#writeIndex];
    }

    swap() {
        const readIndex = this.#readIndex;
        this.#readIndex = this.#writeIndex;
        this.#writeIndex = readIndex;
    }
}

class FrameBuffer {
    /** @type {number} */
    width;
    /** @type {number} */
    height;
    /** @type {WebGLFramebuffer} */
    fb;
    /** @type {WebGLTexture} */
    tex;

    constructor(/** @type {number} */
        width,
        /** @type {number} */
        height,
        /** @type {WebGLFramebuffer} */
        fb,
        /** @type {WebGLTexture} */
        tex) {
        this.width = width;
        this.height = height;
        this.fb = fb;
        this.tex = tex;
    }

    static createRGBA32F(
        /** @type {WebGL2RenderingContext} */
        gl,
        /** @type {number} */
        width,
        /** @type {number} */
        height) {

        const texture = gl.createTexture();
        const level = 0;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        {
            const internalFormat = gl.RGBA32F;
            const border = 0;
            const srcFormat = gl.RGBA;
            const srcType = gl.FLOAT;
            const data = null;

            gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                width, height, border, srcFormat, srcType, data);

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }

        const fb = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fb);

        const attachmentPoint = gl.COLOR_ATTACHMENT0;
        gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, texture, level);

        if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE) {
            alert('Framebuffer not complete!');
        }

        return new FrameBuffer(width, height, fb, texture);
    }
}

export { DoubleBufferedFrameBuffer, FrameBuffer };