away3d.module('away3d.Camera3D', [
    'away3d.Matrix3D',
    'away3d.Object3D',
    'away3d.PerspectiveLens'
],
function()
{
    var Camera3D = function(lens)
    {
        away3d.Object3D.call(this);

        this.lens = lens || new away3d.PerspectiveLens();

        this.$.viewProjection =  new away3d.Matrix3D();
        this.$.viewProjectionDirty = true;
        this.$.aspectRatio = 0;
    };

    Camera3D.prototype = new away3d.Object3D();
    Camera3D.prototype.constructor = Camera3D;


    Camera3D.prototype.invalidateSceneTransform = function()
    {
        away3d.Object3D.prototype.invalidateSceneTransform.call(this);

        this.invalidateViewProjection();
    };


    Camera3D.prototype.invalidateViewProjection = function()
    {
        this.$.viewProjectionDirty = true;
    };


    Camera3D.prototype.getViewProjection = function()
    {
        if (this.$.viewProjectionDirty) {
            // TODO: inverse transform should be on Object3D
            var inv = new away3d.Matrix3D();
            inv.inv(this.transform);
            this.$.viewProjection.mul(inv, this.lens.getProjectionMatrix(this.$.aspectRatio));
            this.$.viewProjectionDirty = false;
        }

        return this.$.viewProjection;
    };


    return Camera3D;
});
