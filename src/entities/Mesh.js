away3d.module('away3d.Mesh', [
    'away3d.Object3D',
    'away3d.Geometry'
],
function()
{
    var Mesh = function(geometry)
    {
        away3d.Object3D.call(this);

        this.geometry = geometry || new away3d.Geometry();
    };

    Mesh.prototype = new away3d.Object3D();
    Mesh.prototype.constructor = Mesh;

    Mesh.prototype.traverse = function(objects)
    {
        objects.push(this);
        away3d.Object3D.prototype.traverse.call(this, objects);
    };

    return Mesh;
});
