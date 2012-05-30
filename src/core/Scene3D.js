away3d.module('away3d.Scene3D', [
    'away3d.Object3D'
],
function()
{
    var Scene3D = function()
    {
        this.$ = {
            root: new away3d.Object3D()
        };
    };

    Scene3D.prototype.appendChild = function(child)
    {
        return this.$.root.appendChild(child);
    };

    Scene3D.prototype.traverse = function(objects)
    {
        return this.$.root.traverse(objects);
    };

    return Scene3D;
});
