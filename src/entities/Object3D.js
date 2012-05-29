away3d.module('away3d.Object3D', [
    'away3d.Matrix3D',
],
function()
{
    var Object3D = function()
    {
        this.transform = new away3d.Matrix3D();

        this.parent = null;
        this.children = [];
    };

    Object3D.prototype.appendChild = function(child)
    {
        child.parent = this;
        this.children.push(child);
    };

    Object3D.prototype.traverse = function(objects)
    {
        var i = this.children.length;
        while (i-->0) {
            this.children[i].traverse(objects);
        }
    };

    return Object3D;
});
