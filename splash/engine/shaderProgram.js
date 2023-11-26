class ShaderProgram {
    /** @type {WebGLProgram} */
    program;
    /** @type {Map} */
    attributes
    /** @type {Map} */
    uniforms

    constructor(
        /** @type {WebGLProgram} */
        program,
        /** @type {Map} */
        attributes,
        /** @type {Map} */
        uniforms,
    ) {
        this.program = program;
        this.attributes = attributes;
        this.uniforms = uniforms;
    }

    /** @type {WebGLUniformLocation} */
    getUniform(/** @type {string} */ name) {
        if (!this.uniforms.has(name)) {
            console.warn(`Unknow uniform ${name}`);
        }
        return this.uniforms.get(name);
    }

    setVertexAttribute(
        /** @type {WebGL2RenderingContext} */
        gl,
        /** @type {WebGLBuffer} */
        buffer,
        /** @type {string} */
        name,
        /** @type {number} */
        numComponents,
        /** @type {number} */
        type,
        /** @type {boolean} */
        normalize = false,
        /** @type {number} */
        stride = 0,
        /** @type {number} */
        offset = 0) {

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        /** @type {number} */
        const index = this.attributes.get(name);

        gl.vertexAttribPointer(index, numComponents, type, normalize, stride, offset);
        gl.enableVertexAttribArray(index);
    }

    static async create(
        /** @type {WebGL2RenderingContext} */ gl,
        /** @type {string} */ vertexShaderPath,
        /** @type {string} */ fragmentShaderPath,
        /** @type {string[]} */
        vertexAttributes,
        /** @type {string[]} */
        uniformLocations,
        /** @type {string[]?} */
        includePaths) {
        const program = await ShaderProgram.createShaderProgramFromFiles(gl, vertexShaderPath, fragmentShaderPath, includePaths);
        if (program === null) {
            return null;
        }

        const attributes = new Map();
        for (const attribute of vertexAttributes) {
            const index = gl.getAttribLocation(program, attribute);
            attributes.set(attribute, index);
        }

        const uniforms = new Map();
        for (const uniform of uniformLocations) {
            const index = gl.getUniformLocation(program, uniform);
            uniforms.set(uniform, index);
        }

        return new ShaderProgram(program, attributes, uniforms);
    }

    static async createShaderProgramFromFiles(
        /** @type {WebGL2RenderingContext} */ gl,
        /** @type {string} */ vertexShaderPath,
        /** @type {string} */ fragmentShaderPath,
        /** @type {string[]?} */
        includePaths) {

        const [vsSource, fsSource, includeSources] = await Promise.all([
            ShaderProgram.loadFile(vertexShaderPath),
            ShaderProgram.loadFile(fragmentShaderPath),
            Promise.all((includePaths ?? []).map(p => ShaderProgram.loadFile(p)))
        ]);

        const vsExtendedSource = [...includeSources, vsSource].join('\n');
        const fsExtendedSource = [...includeSources, fsSource].join('\n');

        const vs = ShaderProgram.createShader(gl, gl.VERTEX_SHADER, vertexShaderPath, vsExtendedSource);
        const fs = ShaderProgram.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderPath, fsExtendedSource);

        if (vs === null || fs === null) {
            return null;
        }

        return ShaderProgram.createShaderProgram(gl, vs, fs, [vertexShaderPath, fragmentShaderPath]);
    }

    static createShaderProgram(
        /** @type {WebGL2RenderingContext} */ gl,
        /** @type {WebGLShader} */ vertexShader,
        /** @type {WebGLShader} */ fragmentShader,
        /** @type {string[]} */ names,) {
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error(`Failed to link shader program ${names}: ${gl.getProgramInfoLog(program)}`);
            return null;
        }

        return program;
    }

    static createShader(
        /** @type {WebGL2RenderingContext} */ gl,
        /** @type {number} */ type,
        /** @type {string} */ name,
        /** @type {string} */ source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error(`Failed to compile shader ${name}: ${gl.getShaderInfoLog(shader)}`)
            return null;
        }

        return shader;
    }

    static async loadFile(/** @type {string} */ file) {
        return fetch(file).then((response) => response.text());
    }
}

export { ShaderProgram };