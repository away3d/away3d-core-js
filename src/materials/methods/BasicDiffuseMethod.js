away3d.module('away3d.BasicDiffuseMethod', null,
function()
{
    var BasicDiffuseMethod = function(color)
    {
        this.$ = {
            color: color
        };

        this.needsVertexNormals = true
    };


    BasicDiffuseMethod.prototype.getFragmentCode = function(util)
    {
        return [
            'float diffuse = dot(normalize(vNormal), lights[0].xyz);',
            'outColor = 0.5 * vec4(diffuse, diffuse, diffuse, 1.0) + inColor;'
        ];
    };

    return BasicDiffuseMethod;
});
