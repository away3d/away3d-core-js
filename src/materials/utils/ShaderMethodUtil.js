away3d.module('away3d.ShaderMethodUtil', null,
function()
{
    var ShaderMethodUtil = function()
    {
        this.$ = {
            firstSamplerIndex: 0
        };
    };


    ShaderMethodUtil.prototype.reset = function()
    {
        this.$.firstSamplerIndex = 0;
    };


    ShaderMethodUtil.prototype.getSampler = function(index)
    {
        return 'uTexture' + (this.$.firstSamplerIndex + index);
    };

    return ShaderMethodUtil;
});
