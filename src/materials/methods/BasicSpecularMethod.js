away3d.module('away3d.BasicSpecularMethod', null,
function()
{
    var BasicSpecularMethod = function(color)
    {
        this.$ = {
            color: color
        };

        this.needsVertexNormals = true
    };


    BasicSpecularMethod.prototype.getFragmentCode = function(util)
    {
        return [
            'vec3 normal = normalize(vNormal);', // TODO: Do this in header?
            'vec3 refDir = -2.0 * dot(lights[0].xyz, normal) * normal + lights[0].xyz;',
            'float specular = pow(max(0.0, dot(refDir, vViewDir)), 100.0);', // TODO: Make gloss uniform
            'outColor = inColor + specular;',
        ];
    };

    return BasicSpecularMethod;
});
