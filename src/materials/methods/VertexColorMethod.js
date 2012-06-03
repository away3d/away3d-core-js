away3d.module('away3d.VertexColorMethod', null,
function()
{
    var ColorMethod = function()
    {
        this.needsVertexColors = true;
    };

    ColorMethod.prototype.activate = function(gl)
    {
    };

    ColorMethod.prototype.getFragmentCode = function()
    {
        return [
            'outColor = vec4(vColor, 1.0);'
        ];
    };



    return ColorMethod;
});
