away3d.module('away3d.Geometry', null,
function()
{
    var Geometry = function()
    {
        this.vertices = [];
        this.indices = [];
        this.colors = [];
        this.uvs = [];

        this.$ = {
            vertexData: [],
            indexData: [],
            colorData: [],
            normalData: [],
            uvData: [],

            vertexBuffer: null,
            indexBuffer: null,
            colorBuffer: null,
            normalBuffer: null,
            uvBuffer: null,

            vertexBufferDirty: true,
            indexBufferDirty: true,
            colorBufferDirty: true,
            normalBufferDirty: true,
            uvBufferDirty: true,

            normalsDirty: true,
        };
    };

    Geometry.prototype.getVertexBuffer = function(gl)
    {
        if (this.$.vertexBufferDirty) {
            this.$.vertexBuffer = this.$.vertexBuffer || gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.$.vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.$.vertexData), gl.STATIC_DRAW);

            this.$.vertexBufferDirty = false;
        }

        return this.$.vertexBuffer;
    };


    Geometry.prototype.getIndexBuffer = function(gl)
    {
        if (this.$.indexBufferDirty) {
            this.$.indexBuffer = this.$.indexBuffer || gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.$.indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.$.indexData), gl.STATIC_DRAW);

            this.$.indexBufferDirty = false;
        }

        return this.$.indexBuffer;
    };


    Geometry.prototype.getNormalBuffer = function(gl)
    {
        if (this.$.normalsDirty) {
            var tri;

            // TODO: Calculate proper normals
            while (this.$.normalData.length < this.$.vertexData.length) {
                this.$.normalData.push(0, 1, 0);
            }

            this.$.normalBufferDirty = true;
        }

        if (this.$.normalBufferDirty) {
            this.$.normalBuffer = this.$.normalBuffer || gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.$.normalBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.$.normalData), gl.STATIC_DRAW);

            this.$.normalBufferDirty = false;
        }

        return this.$.normalBuffer;
    };


    Geometry.prototype.getColorBuffer = function(gl)
    {
        if (this.$.colorBufferDirty) {
            this.$.colorBuffer = this.$.colorBuffer || gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.$.colorBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.$.colorData), gl.STATIC_DRAW);

            this.$.colorBufferDirty = false;
        }

        return this.$.colorBuffer;
    };


    Geometry.prototype.getUVBuffer = function(gl)
    {
        if (this.$.uvBufferDirty) {
            this.$.uvBuffer = this.$.uvBuffer || gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.$.uvBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.$.uvData), gl.STATIC_DRAW);

            this.$.uvBufferDirty = false;
        }

        return this.$.uvBuffer;
    };

    return Geometry;
});
