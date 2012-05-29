away3d.module('away3d.View3D', [
    'away3d.Camera3D',
    'away3d.WebGLRenderer',
    'away3d.Scene3D'
],
function()
{
    var View3D = function(canvas)
    {
        this.canvas = canvas || document.createElement('canvas');
        this.renderer = new away3d.WebGLRenderer(this.canvas);
        this.camera = new away3d.Camera3D();
        this.scene = new away3d.Scene3D();

        // "Private" variables
        this.$ = {
            width: this.canvas.width,
            height: this.canvas.height,
            aspectRatio: this.canvas.width / this.canvas.height
        };
    };


    View3D.prototype.setDimensions = function(w, h)
    {
        this.$.width = w;
        this.$.height = h;
        this.$.aspectRatio = w/h;
        this.canvas.setAttribute('width', w);
        this.canvas.setAttribute('height', h);
    };


    View3D.prototype.render = function()
    {
        this.renderer.render(this);
    };


    return View3D;
});
