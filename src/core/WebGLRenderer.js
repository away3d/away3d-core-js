away3d.module('away3d.WebGLRenderer', null,
function()
{
    var WebGLRenderer = function(canvas)
    {
        this.canvas = canvas;
        this.context = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
    };


    WebGLRenderer.prototype.render = function(scene)
    {
        var gl = this.context;

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        var objects = [];
        scene.traverse(objects);
    };

    return WebGLRenderer;
});
