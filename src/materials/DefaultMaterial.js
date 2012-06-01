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
    };


    DefaultMaterial.prototype.addMethod = function(method)
    {
        this.$.methods.push(method);
    };


    DefaultMaterial.prototype.activate = function(gl, camera)
    {
        this.$.screenPass.activate(gl, camera);
    };


    DefaultMaterial.prototype.render = function(renderable, gl)
    {
        this.$.screenPass.render(renderable, gl);
    };


    DefaultMaterial.prototype.deactivate = function(gl)
    {
        this.$.screenPass.deactivate(gl);
    };


    return DefaultMaterial;
});
