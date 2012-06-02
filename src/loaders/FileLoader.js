away3d.module('away3d.FileLoader', null,
function()
{
    var parsers = [];

    var FileLoader = function()
    {
    };

    FileLoader.enableParser = function(ParserType)
    {
        if (parsers.indexOf(ParserType)<0)
            parsers.push(ParserType);
    };

    FileLoader.prototype.load = function(url)
    {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        
        var self = this;
        xhr.onload = function(ev) {
            var buf = xhr.response;

            // TODO: Don't hard code parser
            var parser = new (parsers[0])();
            parser.addEventListener('asset', function(evt) {
                // TODO: Handle and bubble
                console.log('EVENT!');
            });
            parser.parseAsync(buf);
        };

        // TODO: Handle errors

        xhr.send();
    };

    return FileLoader;
});
