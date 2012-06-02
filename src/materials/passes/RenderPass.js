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
            fragmentShaderDirty: true
        };
    };


    var updateProgram = function(self, gl)
    {
        self.$.program = self.$.program || gl.createProgram();

        if (self.$.vertexShaderDirty) {
            var vs = self.$.vertexShader || gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vs, self.getVertexCode());
            gl.compileShader(vs);

            // TODO: Check for compile errors

            self.$.vertexShader = vs;
            self.$.vertexShaderDirty = false;
        }

        if (self.$.fragmentShaderDirty) {
            var fs = self.$.fragmentShader || gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fs, self.getFragmentCode());
            gl.compileShader(fs);

            self.$.fragmentShader = fs;
            self.$.fragmentShaderDirty = false;
        }

        gl.attachShader(self.$.program, self.$.vertexShader);
        gl.attachShader(self.$.program, self.$.fragmentShader);
        gl.linkProgram(self.$.program);
    };


    RenderPass.prototype.activate = function(gl, camera)
    {
        var pm = camera.getViewProjection();

        if (this.$.vertexShaderDirty || this.$.fragmentShaderDirty) {
            updateProgram(this, gl);
        }

        gl.useProgram(this.$.program);

        var uProjection = gl.getUniformLocation(this.$.program, 'uProjection');
        gl.uniformMatrix4fv(uProjection, false, new Float32Array(pm.data));
    };


    RenderPass.prototype.render = function(renderable, gl, camera)
    {
        var geom = renderable.geometry,
            program = this.$.program;

        program.uTransform = gl.getUniformLocation(program, 'uTransform');
        gl.uniformMatrix4fv(program.uTransform, false, new Float32Array(renderable.sceneTransform.data));

        program.aVertexPosition = gl.getAttribLocation(program, "aVertexPosition");
        gl.enableVertexAttribArray(program.aVertexPosition);
        gl.bindBuffer(gl.ARRAY_BUFFER, geom.getVertexBuffer(gl));
        gl.vertexAttribPointer(program.aVertexPosition, 3, gl.FLOAT, false, 0, 0);

        program.aVertexColor = gl.getAttribLocation(program, "aVertexColor");
        gl.enableVertexAttribArray(program.aVertexColor);
        gl.bindBuffer(gl.ARRAY_BUFFER, geom.getColorBuffer(gl));
        gl.vertexAttribPointer(program.aVertexColor, 3, gl.FLOAT, false, 0, 0);

        program.aTexCoord = gl.getAttribLocation(program, 'aTexCoord');
        gl.enableVertexAttribArray(program.aTexCoord);
        gl.bindBuffer(gl.ARRAY_BUFFER, geom.getUVBuffer(gl));
        gl.vertexAttribPointer(program.aTexCoord, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, geom.getIndexBuffer(gl));
        gl.drawElements(gl.TRIANGLES, geom.$.indexData.length, gl.UNSIGNED_SHORT, 0);
    };


    RenderPass.prototype.deactivate = function(gl)
    {
        // TODO: Unbind buffers et c?
    };


    RenderPass.prototype.getVertexCode = function() 
    {
        return [
            'attribute vec3 aVertexPosition;',
            'attribute vec3 aVertexColor;',
            'attribute vec2 aTexCoord;',
            'uniform mat4 uTransform;',
            'uniform mat4 uProjection;',
            'varying vec4 vColor;',
            'varying vec2 vTexCoord;',
            'void main(void) {',
            '  vColor = vec4(aVertexColor, 1.0);',
            '  vTexCoord = aTexCoord;',
            '  gl_Position = uProjection * uTransform * vec4(aVertexPosition, 1.0);',
            '}'
        ].join('\n');

    };


    RenderPass.prototype.getFragmentCode = function()
    {
        return [
            'varying lowp vec4 vColor;',
            'void main(void) {',
            '  gl_FragColor = vColor;',
            '}'
        ].join('\n');
    };


    return RenderPass;
});
