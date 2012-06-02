away3d.module('away3d.AWD2Parser', [
    'away3d.Parser'
],
function()
{
    var AWD2Parser = function()
    {
        away3d.Parser.call(this);
        this.$.curBlockId = 0;
    };


    AWD2Parser.prototype = new away3d.Parser();
    AWD2Parser.prototype.constructor = AWD2Parser;


    var parseHeader = function(self)
    {
        // Skip "AWD" magic string
        self.$.offset += 3;

        // Header
        var majorVersion = self.readUint8(),
            minorVersion = self.readUint8(),
            flags = self.readUint16(),
            compression = self.readUint8(),
            length = self.readUint32();

        // TODO: Fail if compressed (can't decompress in JS)
    };

    var parseNextBlock = function(self)
    {
        var ns, type, flags, len;

        self.$.curBlockId = self.readUint32();
        ns = self.readUint8();
        type = self.readUint8();
        flags = self.readUint8();
        len = self.readUint32();

        self.postMessage([self.$.curBlockId, ns, type, len]);

        // TODO: Read block content
        self.seek(len);
    };


    AWD2Parser.prototype.parse = function(data)
    {
        this.postMessage('start parsing');

        this.resetData(data, true);

        parseHeader(this);

        this.postMessage('has data: '+this.$.length);
        while (this.hasData()) {
            parseNextBlock(this);
        }
    };

    return AWD2Parser;
});
