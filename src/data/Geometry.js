away3d.module('away3d.Geometry', null,
function()
{
    var Geometry = function()
    {
        this.vertices = [];
        this.indices = [];

        this.vertexBuffer = null;
        this.indexBuffer = null;
    };

    Geometry.prototype.getVertexBuffer = function(gl)
    {
        if (!this.vertexBuffer) {
            this.vertexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
        }

        return this.vertexBuffer;
    };


    Geometry.prototype.getIndexBuffer = function(gl)
    {
        if (!this.indexBuffer) {
            this.indexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
        }

        return this.indexBuffer;
    };

    return Geometry;
});
