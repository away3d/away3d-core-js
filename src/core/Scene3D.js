away3d.module('away3d.Scene3D', [
    'away3d.Object3D'
],
function()
{
    var Scene3D = function()
    {
        this.children = [];
    };

    // Share some but not all methods with Object3D
    Scene3D.prototype.appendChild = away3d.Object3D.prototype.appendChild;
    Scene3D.prototype.traverse = away3d.Object3D.prototype.traverse;

    return Scene3D;
});
