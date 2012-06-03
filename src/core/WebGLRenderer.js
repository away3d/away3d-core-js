away3d.module('away3d.WebGLRenderer', null,
function()
{
    var WebGLRenderer = function(canvas)
    {
        this.canvas = canvas;
        this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
    };


    WebGLRenderer.prototype.render = function(view)
    {
        var gl = this.gl,
            scene = view.scene;

        var renderables = []
        scene.traverse(renderables);

        gl.viewport(0, 0, view.$.width, view.$.height);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LESS);
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);

        var i = renderables.length-1;
        while (i>=0) {
            var mtl = renderables[i].material;
            mtl.activate(gl, view.camera);

            // Render all renderables that use this material
            do {
                var renderable = renderables[i];
                mtl.render(renderable, gl, view.camera);
            } while (i-->0 && renderables[i].material == mtl);

            mtl.deactivate(gl);
        }
    };

    return WebGLRenderer;
});
