away3d.module('away3d.VertexColorMethod', null,
function()
{
    var ColorMethod = function()
    {
    };

    ColorMethod.prototype.activate = function(gl)
    {
    };

    ColorMethod.prototype.getFragmentCode = function()
    {
        return [
            'outColor = vColor;'
        ];
    };



    return ColorMethod;
});
