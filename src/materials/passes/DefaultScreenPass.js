away3d.module('away3d.DefaultScreenPass', [
    'away3d.RenderPass',
    'away3d.ShaderMethodUtil'
],
function()
{
    var DefaultScreenPass = function(material)
    {
        away3d.RenderPass.call(this, material);

        this.$.methodUtil = new away3d.ShaderMethodUtil();
    };


    DefaultScreenPass.prototype = new away3d.RenderPass();
    DefaultScreenPass.constructor = DefaultScreenPass;


    DefaultScreenPass.prototype.activate = function(gl, camera)
    {
        away3d.RenderPass.prototype.activate.call(this, gl, camera);

        var i, len,
            methods = this.$.material.$.methods;

        len = methods.length;
        for (i=0; i<len; i++) {
            methods[i].activate(gl, this.$.program);
        }
    };


    DefaultScreenPass.prototype.getFragmentCode = function()
    {
        var i, len, code,
            util = this.$.methodUtil,
            methods = this.$.material.$.methods,
            calls = [];

        i = methods.length;
        this.$.numSamplersNeeded = 0;
        while (i-->0) {
            this.$.needsUvs = this.$.needsUvs || methods[i].needsUvs;
            this.$.needsVertexColors = this.$.needsVertexColors || methods[i].needsVertexColors;
            this.$.numSamplersNeeded += (methods[i].numSamplersNeeded || 0);
        }

        code = [
            this.getFragmentCodeHeader(),

            // TODO: Create ambient method type
            'void ambient(out vec4 outColor) {',
            '  outColor = vec4(1.0, 1.0, 1.0, 1.0);',
            '}'
        ];

        util.reset();

        len = methods.length;
        for (i=0; i<len; i++) {
            var name = 'method'+i;
            code.push('void '+name+'(in vec4 inColor, out vec4 outColor) {');
            code.push.apply(code, methods[i].getFragmentCode(util));
            code.push('}');

            calls.push('  '+name+'(tmp,tmp);');

            // Increment the number of samplers used
            util.$.firstSamplerIndex += (methods[i].numSamplersNeeded || 0);
        };

        code.push.apply(code, [
            'void main(void) {',
            '  vec4 tmp;',
            '  ambient(tmp);'
        ]);
        code.push.apply(code, calls);
        code.push.apply(code, [
            '  gl_FragColor = tmp;',
            '}'
        ]);

        return code.join('\n');
    };

    return DefaultScreenPass;
});
