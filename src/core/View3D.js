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
        this.camera.z = -1000;
        this.scene = new away3d.Scene3D();

        // "Private" variables
        this.$ = {
            width: this.canvas.width,
            height: this.canvas.height,
            aspectRatio: this.canvas.width / this.canvas.height
        };
    };


    Object.defineProperty(View3D.prototype, 'width', {
        get: function() {
            return this.$.width;
        },
        set: function(value) {
            this.$.width = value;
            this.$.aspectRatio = this.$.width / this.$.height;
        }
    });
        

    Object.defineProperty(View3D.prototype, 'height', {
        get: function() {
            return this.$.height;
        },
        set: function(value) {
            this.$.height = value;
            this.$.aspectRatio = this.$.width / this.$.height;
        }
    });


    View3D.prototype.render = function()
    {
        this.camera.$.aspectRatio = this.$.aspectRatio;
        this.renderer.render(this);
    };


    return View3D;
});
