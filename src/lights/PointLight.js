away3d.module('away3d.PointLight', [
	'away3d.Object3D'
],
function()
{
	var PointLight = function(radius)
	{
		away3d.Object3D.call(this);

		this.radius = radius;
	};


	PointLight.prototype = new away3d.Object3D();
	PointLight.prototype.constructor = PointLight;

	return PointLight;
});
