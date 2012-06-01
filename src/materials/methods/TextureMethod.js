//TODO: Replace with larger general diffuse method
away3d.module('away3d.TextureMethod', null,
function()
{
    var TextureMethod = function(texture)
    {
        this.$ = {
            texture: texture
        };
    };


    TextureMethod.prototype.activate = function(gl, program)
    {
        // TODO: Make sure that samplers don't collide
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.$.texture.getTexture(gl));
        gl.uniform1i(gl.getUniformLocation(program, 'uTexture0'), 0);
    };


    TextureMethod.prototype.getFragmentCode = function()
    {
        return [
            'outColor = texture2D(uTexture0, vTexCoord);'
        ];
    };


    TextureMethod.prototype.deactivate = function()
    {
        gl.bindTexture(gl.TEXTURE_2D, null);
    };

    return TextureMethod;
});
