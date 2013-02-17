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
            'float diffuse = abs(dot(normalize(vNormal), lights[0].xyz));',
            'outColor = inColor * 0.5 + 0.5 * inColor * vec4(diffuse, diffuse, diffuse, 1.0);'
        ];
    };

    return BasicDiffuseMethod;
});
