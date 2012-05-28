away3d.module('away3d.Object3D', null,
function()
{
    var Object3D = function()
    {
        this.x = 0;
        this.y = 0;
        this.z = 0;

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
