away3d.module('away3d.Geometry', null,
function()
{
    var Geometry = function()
    {
        this.vertices = [];
        this.indices = [];
        this.colors = [];

        this.$ = {
            vertexBuffer: null,
            indexBuffer: null,
            colorBuffer: null,

            vertexBufferDirty: true,
            indexBufferDirty: true,
            colorBufferDirty: true
        };
    };

    Geometry.prototype.getVertexBuffer = function(gl)
    {
        if (this.$.vertexBufferDirty) {
            this.$.vertexBuffer = this.$.vertexBuffer || gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.$.vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
        }

        return this.$.vertexBuffer;
    };


    Geometry.prototype.getIndexBuffer = function(gl)
    {
        if (this.$.indexBufferDirty) {
            this.$.indexBuffer = this.$.indexBuffer || gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.$.indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
        }

        return this.$.indexBuffer;
    };


    Geometry.prototype.getColorBuffer = function(gl)
    {
        if (this.$.colorBufferDirty) {
            this.$.colorBuffer = this.$.colorBuffer || gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.$.colorBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);
        }

        return this.$.colorBuffer;
    };

    return Geometry;
});
