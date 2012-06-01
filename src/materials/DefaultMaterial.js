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


    DefaultMaterial.prototype.render = function(renderable, gl, camera)
    {
        this.$.screenPass.render(renderable, gl, camera);
    };


    return DefaultMaterial;
});
