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
            vertexData: null,
            indexData: null,
            colorData: null,
            vertexNormalData: null,
            faceNormalData: null,
            uvData: null,

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

            vertexNormalsDirty: false,
            vertexTangentsDirty: false,
            faceNormalsDirty: true,
            faceTagentsDirty: true
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
        if (!this.$.vertexNormalData || this.$.vertexNormalsDirty) {
            updateVertexNormals(this.$);

            this.$.normalBufferDirty = true;
        }

        if (this.$.normalBufferDirty) {
            this.$.normalBuffer = this.$.normalBuffer || gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.$.normalBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.$.vertexNormalData), gl.STATIC_DRAW);

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


    var updateFaceNormals = function($)
    {
        var i, j, k;
        var index;
        var len;
        var x1, x2, x3;
        var y1, y2, y3;
        var z1, z2, z3;
        var dx1, dy1, dz1;
        var dx2, dy2, dz2;
        var cx, cy, cz;
        var d;
        var faceNormalsData;

        var vertices = $.vertexData,
            indices = $.indexData;

        faceNormalData = $.faceNormalData = [];
        len = indices.length;
        //if (_useFaceWeights) _faceWeights ||= new Vector.<Number>(len/3, true);

        i = 0; j = 0;

        while (i < len) {
            index = indices[i++]*3;
            x1 = vertices[index++];
            y1 = vertices[index++];
            z1 = vertices[index];
            index = indices[i++]*3;
            x3 = vertices[index++]; // TODO: Verify that it's ok to switch 3 and 2 like this
            y3 = vertices[index++];
            z3 = vertices[index];
            index = indices[i++]*3;
            x2 = vertices[index++];
            y2 = vertices[index++];
            z2 = vertices[index];
            dx1 = x3-x1;
            dy1 = y3-y1;
            dz1 = z3-z1;
            dx2 = x2-x1;
            dy2 = y2-y1;
            dz2 = z2-z1;
            cx = dz1*dy2 - dy1*dz2;
            cy = dx1*dz2 - dz1*dx2;
            cz = dy1*dx2 - dx1*dy2;
            d = Math.sqrt(cx*cx+cy*cy+cz*cz);
            // length of cross product = 2*triangle area
            /*
            if (_useFaceWeights) {
                var w : Number = d*10000;
                if (w < 1) w = 1;
                _faceWeights[k++] = w;
            }
            */
            d = 1/d;
            faceNormalData[j++] = cx*d;
            faceNormalData[j++] = cy*d;
            faceNormalData[j++] = cz*d;
        }

        $.faceNormalsDirty = false;
        $.faceTangentsDirty = true;
    };


    var updateVertexNormals = function($)
    {
        if ($.faceNormalsDirty)
            updateFaceNormals($);
        
        var vertices = $.vertexData,
            indices = $.indexData,
            faceNormals = $.faceNormalData,
            vertexNormals = $.vertexNormalData = [];
            
        var v1, v2, v3;
        var f1 = 0, f2 = 1, f3 = 2;
        var lenV = vertices.length;

        // Reset
        v1 = 0;
        while (v1 < lenV) {
            vertexNormals[v1++] = 0.0;
        }

        // reset, yo
        //if (_vertexNormals) while (v1 < lenV) _vertexNormals[v1++] = 0.0;
        //else _vertexNormals = new Vector.<Number>(_vertices.length, true);

        var i=0 , k=0;
        var lenI = indices.length;
        var index;
        var weight;

        while (i < lenI) {
            // TODO: Implement face weights
            //weight = _useFaceWeights? _faceWeights[k++] : 1;
            weight = 1;

            index = indices[i++]*3;
            vertexNormals[index++] += faceNormals[f1]*weight;
            vertexNormals[index++] += faceNormals[f2]*weight;
            vertexNormals[index] += faceNormals[f3]*weight;
            index = indices[i++]*3;
            vertexNormals[index++] += faceNormals[f1]*weight;
            vertexNormals[index++] += faceNormals[f2]*weight;
            vertexNormals[index] += faceNormals[f3]*weight;
            index = indices[i++]*3;
            vertexNormals[index++] += faceNormals[f1]*weight;
            vertexNormals[index++] += faceNormals[f2]*weight;
            vertexNormals[index] += faceNormals[f3]*weight;
            f1 += 3;
            f2 += 3;
            f3 += 3;
        }

        v1 = 0; v2 = 1; v3 = 2;
        while (v1 < lenV) {
            var vx = vertexNormals[v1];
            var vy = vertexNormals[v2];
            var vz = vertexNormals[v3];
            var d = 1.0/Math.sqrt(vx*vx+vy*vy+vz*vz);
            vertexNormals[v1] *= d;
            vertexNormals[v2] *= d;
            vertexNormals[v3] *= d;
            v1 += 3;
            v2 += 3;
            v3 += 3;
        }

        $.vertexNormalsDirty = false;
    };

    return Geometry;
});
