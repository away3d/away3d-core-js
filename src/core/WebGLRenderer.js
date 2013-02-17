away3d.module('away3d.WebGLRenderer', null,
function()
{
    var nextMaterialId = 1;

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

        renderables.sort(sortOnMaterial);

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

    var sortOnMaterial = function(r0, r1) 
    {
        if (!r0.material.id)
            r0.material.id = nextMaterialId++;

        if (!r1.material.id)
            r1.material.id = nextMaterialId++;

        return (r0.material.id - r1.material.id);
    };

    return WebGLRenderer;
});
