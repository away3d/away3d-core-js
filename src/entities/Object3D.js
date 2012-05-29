away3d.module('away3d.Object3D', [
    'away3d.Matrix3D',
],
function()
{
    var Object3D = function()
    {
        this.parent = null;
        this.children = [];

        this.$ = {
            x: 0,
            y: 0,
            z: 0,
            rotationX: 0,
            rotationY: 0,
            rotationZ: 0,
            scaleX: 1,
            scaleY: 1,
            scaleZ: 1,
            transform: new away3d.Matrix3D(),
            transformDirty: true
        }
    };

    Object.defineProperty(Object3D.prototype, 'x', {
        get: function() { return this.$.x; },
        set: function(value) {
            if (this.$.x != value) {
                this.$.x = value;
                this.$.transformDirty = true;
            }
        }
    });

    Object.defineProperty(Object3D.prototype, 'y', {
        get: function() { return this.$.y; },
        set: function(value) {
            if (this.$.y != value) {
                this.$.y = value;
                this.$.transformDirty = true;
            }
        }
    });

    Object.defineProperty(Object3D.prototype, 'z', {
        get: function() { return this.$.z; },
        set: function(value) {
            if (this.$.z != value) {
                this.$.z = value;
                this.$.transformDirty = true;
            }
        }
    });

    Object.defineProperty(Object3D.prototype, 'scaleX', {
        get: function() { return this.$.scaleX; },
        set: function(value) {
            if (this.$.scaleX != value) {
                this.$.scaleX = value;
                this.$.transformDirty = true;
            }
        }
    });

    Object.defineProperty(Object3D.prototype, 'scaleY', {
        get: function() { return this.$.scaleY; },
        set: function(value) {
            if (this.$.scaleY != value) {
                this.$.scaleY = value;
                this.$.transformDirty = true;
            }
        }
    });

    Object.defineProperty(Object3D.prototype, 'scaleZ', {
        get: function() { return this.$.scaleZ; },
        set: function(value) {
            if (this.$.scaleZ != value) {
                this.$.scaleZ = value;
                this.$.transformDirty = true;
            }
        }
    });

    Object.defineProperty(Object3D.prototype, 'rotationX', {
        get: function() { return this.$.rotationX; },
        set: function(value) {
            if (this.$.rotationX != value) {
                this.$.rotationX = value;
                this.$.transformDirty = true;
            }
        }
    });

    Object.defineProperty(Object3D.prototype, 'rotationY', {
        get: function() { return this.$.rotationY; },
        set: function(value) {
            if (this.$.rotationY != value) {
                this.$.rotationY = value;
                this.$.transformDirty = true;
            }
        }
    });

    Object.defineProperty(Object3D.prototype, 'rotationZ', {
        get: function() { return this.$.rotationZ; },
        set: function(value) {
            if (this.$.rotationZ != value) {
                this.$.rotationZ = value;
                this.$.transformDirty = true;
            }
        }
    });

    Object.defineProperty(Object3D.prototype, 'transform', {
        get: function() {
            if (this.$.transformDirty) {
                updateTransform(this);
            }
            
            return this.$.transform;
        },
        set: function(value) {
            this.$.transformDirty = false;
            this.$.transform = value;
        }
    });


    var updateTransform = function(self)
    {
        // TODO: Optimize this
        var trans = away3d.Matrix3D.Translation(self.$.x, self.$.y, self.$.z),
            rot = away3d.Matrix3D.Rotation(self.$.rotationX, self.$.rotationY, self.$.rotationZ),
            scale = away3d.Matrix3D.Scale(self.$.scaleX, self.$.scaleY, self.$.scaleZ);

        self.$.transform = new away3d.Matrix3D();
        self.$.transform.mul(trans, rot);
        self.$.transform.mul(self.$.transform, scale);

        self.$.transformDirty = false;
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
