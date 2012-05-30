away3d.module('away3d.PerspectiveLens', [
    'away3d.Matrix3D'
],
function()
{
    var PerspectiveLens = function(fov)
    {
        this.fov = fov || 45;
        this.near = 0.1;
        this.far = 10000;
    };


    PerspectiveLens.prototype.getProjectionMatrix = function(aspectRatio)
    {
        // TODO: Optimize this (cache and validate)
        var pm = new away3d.Matrix3D();

        var invfoc = Math.tan(this.fov*Math.PI/360),
            ymax = this.near * invfoc,
            xmax = ymax * aspectRatio;

        var i = 16;
        while (i-->0) {
            pm.data[i] = 0;
        }

        pm.data[0] = this.near / xmax;
        pm.data[5] = this.near / ymax;
        pm.data[10] = -this.far / (this.far-this.near);
        pm.data[11] = 1;
        pm.data[14] = -this.near * pm.data[10];
        pm.data[15] = 0;

        return pm;
    };

    return PerspectiveLens;
});
