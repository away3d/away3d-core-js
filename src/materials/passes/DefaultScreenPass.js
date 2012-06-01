away3d.module('away3d.DefaultScreenPass', [
    'away3d.RenderPass'
],
function()
{
    var DefaultScreenPass = function(material)
    {
        away3d.RenderPass.call(this, material);
    };


    DefaultScreenPass.prototype = new away3d.RenderPass();
    DefaultScreenPass.constructor = DefaultScreenPass;


    DefaultScreenPass.prototype.getFragmentCode = function()
    {
        var i, len, code,
            methods = this.$.material.$.methods,
            calls = [];

        code = [
            // TODO: Check dependencies
            'varying lowp vec4 vColor;',
            'varying lowp vec2 vTexCoord;',

            // TODO: Create ambient method type
            'void ambient(out lowp vec4 outColor) {',
            '  outColor = vec4(1.0, 1.0, 1.0, 1.0);',
            '}'
        ];

        len = methods.length;
        for (i=0; i<len; i++) {
            var name = 'method'+i;
            code.push('void '+name+'(in lowp vec4 inColor, out lowp vec4 outColor) {');
            code.push.apply(code, methods[i].getFragmentCode());
            code.push('}');

            calls.push('  '+name+'(tmp,tmp);');
        };

        code.push.apply(code, [
            'void main(void) {',
            '  lowp vec4 tmp;',
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
