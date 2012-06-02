away3d.module('away3d.AWD2Parser', [
    'away3d.Parser'
],
function()
{
    var AWD2Parser = function()
    {
    };


    AWD2Parser.prototype = new away3d.Parser();
    AWD2Parser.prototype.constructor = AWD2Parser;



    AWD2Parser.prototype.parse = function(data)
    {
        // TODO: Actually parse
        this.postMessage('start parsing');
    };

    return AWD2Parser;
});
