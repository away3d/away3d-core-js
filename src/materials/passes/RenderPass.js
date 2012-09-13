away3d.module('away3d.RenderPass', null,
function()
{
    var RenderPass = function(material)
    {
        this.$ = {
            material: material,
            program: null,
            vertexShader: null,
            fragmentShader: null,
            vertexShaderDirty: true,
            fragmentShaderDirty: true,

            needsUvs: false,
            needsVertexColors: false,
            needsVertexNormals: false,
            numSamplersNeeded: 0
        };
    };


    var updateProgram = function(self, gl)
    {
        var i, numLights,
            program = self.$.program || gl.createProgram();

        if (self.$.fragmentShaderDirty) {
            var fs = self.$.fragmentShader || gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fs, self.getFragmentCode());
            gl.compileShader(fs);

            // TODO: Check for compile errors

            self.$.fragmentShader = fs;
            self.$.fragmentShaderDirty = false;
        }

        if (self.$.vertexShaderDirty) {
            var vs = self.$.vertexShader || gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vs, self.getVertexCode());
            gl.compileShader(vs);

            // TODO: Check for compile errors

            self.$.vertexShader = vs;
            self.$.vertexShaderDirty = false;
        }

        gl.attachShader(program, self.$.vertexShader);
        gl.attachShader(program, self.$.fragmentShader);
        gl.linkProgram(program);

        program.uTransform = gl.getUniformLocation(program, 'uTransform');
        program.uCameraPosition = gl.getUniformLocation(program, 'uCameraPosition');
        program.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
        program.aVertexNormal = gl.getAttribLocation(program, 'aVertexNormal');
        program.aVertexColor = gl.getAttribLocation(program, 'aVertexColor');
        program.aTexCoord = gl.getAttribLocation(program, 'aTexCoord');

        program.uLights = [];
        numLights = self.$.material.lights.length;
        for (i=0; i<numLights; i++) {
            program.uLights[i] = gl.getUniformLocation(program, 'uLights['+i+']');
        }

        self.$.program = program;
    };


    RenderPass.prototype.activate = function(gl, camera)
    {
        var i, numLights, pm = camera.getViewProjection();

        if (this.$.vertexShaderDirty || this.$.fragmentShaderDirty) {
            updateProgram(this, gl);
        }

        gl.useProgram(this.$.program);

        // TODO: Move this to link-time
        var uProjection = gl.getUniformLocation(this.$.program, 'uProjection');
        gl.uniformMatrix4fv(uProjection, false, pm.data);

        // TODO: Optimize by setting a vector directly using uniform4fv?
        numLights = this.$.program.uLights.length;
        for (i=0; i<numLights; i++) {
            // TODO: Optimize
            gl.uniform4f(this.$.program.uLights[i],
                this.$.material.lights[i].x,
                this.$.material.lights[i].y,
                this.$.material.lights[i].z,
                1.0);
        }
    };


    RenderPass.prototype.render = function(renderable, gl, camera)
    {
        var geom = renderable.geometry,
            program = this.$.program;

        gl.uniformMatrix4fv(program.uTransform, false, renderable.sceneTransform.data);

        // TODO: Use scene position!
        gl.uniform3f(program.uCameraPosition, false, camera.x, camera.y, camera.z);

        gl.enableVertexAttribArray(program.aVertexPosition);
        gl.bindBuffer(gl.ARRAY_BUFFER, geom.getVertexBuffer(gl));
        gl.vertexAttribPointer(program.aVertexPosition, 3, gl.FLOAT, false, 0, 0);

        if (this.$.needsVertexNormals) {
            gl.enableVertexAttribArray(program.aVertexNormal);
            gl.bindBuffer(gl.ARRAY_BUFFER, geom.getNormalBuffer(gl));
            gl.vertexAttribPointer(program.aVertexNormal, 3, gl.FLOAT, false, 0, 0);
        }

        if (this.$.needsVertexColors) {
            gl.enableVertexAttribArray(program.aVertexColor);
            gl.bindBuffer(gl.ARRAY_BUFFER, geom.getColorBuffer(gl));
            gl.vertexAttribPointer(program.aVertexColor, 3, gl.FLOAT, false, 0, 0);
        }

        if (this.$.needsUvs) {
            gl.enableVertexAttribArray(program.aTexCoord);
            gl.bindBuffer(gl.ARRAY_BUFFER, geom.getUVBuffer(gl));
            gl.vertexAttribPointer(program.aTexCoord, 2, gl.FLOAT, false, 0, 0);
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, geom.getIndexBuffer(gl));
        gl.drawElements(gl.TRIANGLES, geom.$.indexData.length, gl.UNSIGNED_SHORT, 0);
    };


    RenderPass.prototype.deactivate = function(gl)
    {
        // TODO: Unbind buffers et c?
    };


    RenderPass.prototype.getFragmentCodeHeader = function()
    {
        var i, numLights, lines = [
            '#ifdef GL_FRAGMENT_PRECISION_HIGH',
            'precision highp float;',
            '#else',
            'precision lowp float;',
            '#endif',
            'precision lowp int;',
            'varying vec3 vPosition;',
            'varying vec3 vViewDir;',
            'vec3 viewDir = normalize(vViewDir);'
        ];

        if (this.$.needsUvs) lines.push('varying vec2 vTexCoord;');
        if (this.$.needsVertexColors) lines.push('varying vec3 vColor;');
        if (this.$.needsVertexNormals) lines.push('varying vec3 vNormal;');

        for (i=0; i<this.$.numSamplersNeeded; i++) {
            lines.push('uniform sampler2D uTexture'+i+';');
        }

        numLights = this.$.material.lights.length;
        if (numLights) {
            lines.push(
                'const int numLights = '+numLights+';',
                'uniform vec4 uLights[numLights];',
                'vec4 lights[numLights];'
            );
        }

        lines.push('void initLights() {');
        for (i=0; i<numLights; i++) {
            var light = this.$.material.lights[i];
            lines.push(
                // TODO: Use scene position
                '  lights['+i+'] = vec4(normalize(uLights['+i+'].xyz - vPosition), uLights['+i+'].w);'
            );
        }
        lines.push('}');

        return lines.join('\n');
    };


    RenderPass.prototype.getVertexCode = function() 
    {
        var lines, header, body;
        
        header = [
            'precision highp float;',
            'precision lowp int;',
            'uniform mat4 uTransform;',
            'uniform mat4 uProjection;',
            'uniform vec3 uCameraPosition;',
            'attribute vec3 aVertexPosition;',
            'varying vec3 vPosition;',
            'varying vec3 vViewDir;',
        ];

        body = [ 'void main(void) {' ];

        if (this.$.needsUvs) {
            header.push(
                'attribute vec2 aTexCoord;',
                'varying vec2 vTexCoord;');
            body.push('  vTexCoord = aTexCoord;');
        }

        if (this.$.needsVertexNormals) {
            header.push(
                'attribute vec3 aVertexNormal;',
                'varying vec3 vNormal;');
            body.push(
                // TODO: Consider using vec4 for vNormal
                '  vNormal = (uTransform * vec4(aVertexNormal, 1.0)).xyz;');
        }

        if (this.$.needsVertexColors) {
            header.push(
                'attribute vec3 aVertexColor;',
                'varying vec3 vColor;');
            body.push('  vColor = aVertexColor;');
        }

        lines = [];
        lines.push.apply(lines, header);
        lines.push.apply(lines, body);
        lines.push(
            '  gl_Position = uProjection * uTransform * vec4(aVertexPosition, 1.0);',
            '  vPosition = gl_Position.xyz;',
            '  vViewDir = vPosition - uCameraPosition;',
            '}');

        return lines.join('\n');
    };


    RenderPass.prototype.getFragmentCode = function()
    {
        // TODO: Remove this entirely?
        return [
            'void main(void) {',
            '  gl_FragColor = vec4(1.0, 0.75, 0.0, 1.0);',
            '}'
        ].join('\n');
    };


    return RenderPass;
});
