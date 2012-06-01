away3d.module('away3d.DefaultMaterial', [
    'away3d.RenderPass'
],
function()
{
    var DefaultMaterial = function()
    {
        this.$ = {
            // TODO: Use dedicated pass type instead
            screenPass: new away3d.RenderPass(this)
        };
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
