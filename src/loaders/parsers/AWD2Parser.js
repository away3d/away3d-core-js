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

        if (ns == 0) {
            // TODO: Implement all block types
            switch (type) {
                case 1:
                    parseGeometry(self);
                    break;
                default:
                    // Unknown block type
                    self.seek(len);
                    break;
            };
        }
        else {
            // TODO: Deal with user blocks
            self.seek(len);
        }
    };

    var parseVarStr = function(self)
    {
        // TODO: Read string
        self.seek(self.readUint16());
        return '';
    };

    var parseProperties = function(self)
    {
        // TODO: Don't skip properties
        self.seek(self.readUint32());
    };

    var parseGeometry = function(self)
    {
        var name, numSubs, subsParsed, data;

        // TODO: Do this per sub when subs are supported
        data = {
            vertexData: [],
            indexData: [],
            uvData: []
        };

        name = parseVarStr(self);
        numSubs = self.readUint16();

        // Geometry has no properties
        parseProperties(self);

        subsParsed = 0;
        while (subsParsed < numSubs) {
            var subLen, subEnd;

            subLen = self.readUint32();

            // SubGeometry has no properties
            parseProperties(self);

            subEnd = self.$.offset + subLen;

            while (self.$.offset < subEnd) {
                var strType, strFormat, strLen, strEnd;

                strType = self.readUint8();
                strFormat = self.readUint8();
                strLen = self.readUint32();
                strEnd = self.$.offset + strLen;

                // TODO: Respect strFormat

                if (strType == 1) {
                    while (self.$.offset < strEnd) {
                        data.vertexData.push(self.readFloat32());
                    }
                }
                else if (strType == 2) {
                    while (self.$.offset < strEnd) {
                        var i0 = self.readUint16();
                        data.indexData.push(self.readUint16());
                        data.indexData.push(i0);
                        data.indexData.push(self.readUint16());
                    }
                }
                else if (strType == 3) {
                    while (self.$.offset < strEnd) {
                        data.uvData.push(self.readFloat32());
                    }
                }
                else {
                    // TODO: Support all streams type
                    // Unsupported stream type
                    self.seek(strLen);
                }
            }

            // TODO: Deal with user attributes
            self.seek(4);

            subsParsed++;
        }

        // TODO: Deal with user attributes
        self.seek(4);

        self.finalizeAsset('geom', data, self.$.curBlockId);
    };


    AWD2Parser.prototype.parse = function(data)
    {

        this.resetData(data, true);

        parseHeader(this);

        while (this.hasData()) {
            parseNextBlock(this);
        }
    };

    return AWD2Parser;
});
