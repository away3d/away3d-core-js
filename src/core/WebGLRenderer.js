away3d.module('away3d.WebGLRenderer', null,
function()
{
    var WebGLRenderer = function(canvas)
    {
        this.canvas = canvas;
        this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
    };

    var getSimpleVertexShader = function(gl)
    {
        var code = [
            'attribute vec3 aVertexPosition;',
            'uniform mat4 uTransform;',
            'uniform mat4 uProjection;',
            'void main(void) {',
            '  gl_Position = uProjection * uTransform * vec4(aVertexPosition, 1.0);',
            //'  gl_Position = uTransform * vec4(aVertexPosition, 1.0);',
            '}'
        ].join('\n');

        var shader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(shader, code);
        gl.compileShader(shader);

        return shader;
    };

    var getSimpleFragmentShader = function(gl)
    {
        var code = [
            'void main(void) {',
            '  gl_FragColor = vec4(1.0, 0.75, 0.0, 1.0);',
            '}'
        ].join('\n');

        var shader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(shader, code);
        gl.compileShader(shader);

        return shader;
    };


    WebGLRenderer.prototype.render = function(view)
    {
        var gl = this.gl,
            scene = view.scene,
            pm = view.camera.getViewProjection(view.$.aspectRatio);

        var renderables = []
        scene.traverse(renderables);

        gl.viewport(0, 0, view.$.width, view.$.height);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        var i = renderables.length;
        while (i-->0) {
            var renderable = renderables[i];
            var geom = renderable.geometry;

            var program = gl.createProgram();
            gl.attachShader(program, getSimpleVertexShader(gl));
            gl.attachShader(program, getSimpleFragmentShader(gl));
            gl.linkProgram(program);
            gl.useProgram(program);

            gl.bindBuffer(gl.ARRAY_BUFFER, geom.getVertexBuffer(gl));

            program.aVertexPosition = gl.getAttribLocation(program, "aVertexPosition");
            gl.enableVertexAttribArray(program.aVertexPosition);
            gl.vertexAttribPointer(program.aVertexPosition, 3, gl.FLOAT, false, 0, 0);

            program.uTransform = gl.getUniformLocation(program, 'uTransform');
            gl.uniformMatrix4fv(program.uTransform, false, new Float32Array(renderable.sceneTransform.data));

            program.uProjection = gl.getUniformLocation(program, 'uProjection');
            gl.uniformMatrix4fv(program.uProjection, false, new Float32Array(pm.data));

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, geom.getIndexBuffer(gl));
            gl.drawElements(gl.TRIANGLES, geom.indices.length, gl.UNSIGNED_SHORT, 0);
        }
    };

    return WebGLRenderer;
});
