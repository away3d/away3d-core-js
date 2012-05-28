away3d.module('away3d.View3D', [
    'away3d.WebGLRenderer'
],
function()
{
    var View3D = function(canvas)
    {
        this.canvas = canvas || document.createElement('canvas');
        this.renderer = new away3d.WebGLRenderer(this.canvas);
    };


    View3D.prototype.render = function()
    {
        this.renderer.render();
    };

    return View3D;
});
