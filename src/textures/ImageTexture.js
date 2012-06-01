away3d.module('away3d.ImageTexture', null,
function()
{
    var ImageTexture = function(image)
    {
        this.$ = {
            image: image,
            texture: null,
            textureDirty: true
        };
    };


    ImageTexture.prototype.getTexture = function(gl)
    {
        if (this.$.textureDirty) {
            this.$.texture = this.$.texture || gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, this.$.texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.$.image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.bindTexture(gl.TEXTURE_2D, null);
        };

        return this.$.texture;
    };


    return ImageTexture;
});
