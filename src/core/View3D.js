away3d.module('away3d.View3D', [
    'away3d.WebGLRenderer',
    'away3d.Scene3D'
],
function()
{
    var View3D = function(canvas)
    {
        this.canvas = canvas || document.createElement('canvas');
        this.renderer = new away3d.WebGLRenderer(this.canvas);
        this.scene = new away3d.Scene3D();
    };


    View3D.prototype.render = function()
    {
        this.renderer.render(this.scene);
    };


    return View3D;
});
