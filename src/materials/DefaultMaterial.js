away3d.module('away3d.DefaultMaterial', [
    'away3d.DefaultScreenPass'
],
function()
{
    var DefaultMaterial = function()
    {
        this.$ = {
            screenPass: new away3d.DefaultScreenPass(this),
            methods: []
        };

        this.lights = [];
    };


    DefaultMaterial.prototype.addMethod = function(method)
    {
        this.$.methods.push(method);
        this.$.screenPass.$.fragmentShaderDirty = true;
        this.$.screenPass.$.vertexShaderDirty = true;
    };


    DefaultMaterial.prototype.activate = function(gl, camera)
    {
        this.$.screenPass.activate(gl, camera);
    };


    DefaultMaterial.prototype.render = function(renderable, gl, camera)
    {
        this.$.screenPass.render(renderable, gl, camera);
    };


    DefaultMaterial.prototype.deactivate = function(gl)
    {
        this.$.screenPass.deactivate(gl);
    };


    return DefaultMaterial;
});
