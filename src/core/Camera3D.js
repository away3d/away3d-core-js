away3d.module('away3d.Camera3D', [
    'away3d.Matrix3D',
    'away3d.Object3D',
    'away3d.PerspectiveLens'
],
function()
{
    var Camera3D = function(lens)
    {
        this.lens = lens || new away3d.PerspectiveLens();
    };

    Camera3D.prototype = new away3d.Object3D();
    Camera3D.prototype.constructor = Camera3D;


    Camera3D.prototype.getViewProjection = function(aspectRatio)
    {
        // TODO: Optimize this (cache and validate)
        var vp = new away3d.Matrix3D();
        var inv = new away3d.Matrix3D();

        inv.inv(this.transform);
        vp.mul(inv, this.lens.getProjectionMatrix(aspectRatio));

        return vp;
    };


    return Camera3D;
});
