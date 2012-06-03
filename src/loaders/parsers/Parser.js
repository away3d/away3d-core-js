away3d.module('away3d.Parser', [
    'away3d.EventTarget',
    'away3d.Event3D',
    'away3d.Geometry'
],
function()
{
    var Parser = function()
    {
        if (away3d.EventTarget) {
            away3d.EventTarget.call(this);
        }

        this.$ = this.$ || {};
        this.$.offset = 0;
        this.$.length = 0;
        this.$.littleEndian = true;
        this.$.data = null;
    };


    if (away3d.EventTarget) {
        Parser.prototype = new away3d.EventTarget();
        Parser.prototype.constructor = Parser;
    }


    var copyAssetInternalData = function(asset, data)
    {
        var prop;
        for (prop in data) {
            asset.$[prop] = data[prop];
        }
    };


    Parser.prototype.parseAsync = function(data)
    {
        var loc = String(document.location).substr(0, String(document.location).lastIndexOf('/'));
        var bSrc = loc + '/' + away3d.originOfModule(Parser);
        var pSrc = loc + '/' + away3d.originOfModule(this.constructor);
        // TODO: Check so bSrc != pSrc (which it will be when library is concatenated together)
        var script = [
            'var away3d = {};',
            // TODO: Consider way to make this independent of module format
            'away3d.module = function(m,d,f) {',

            // TODO: Don't hard-code parser name
            '  if (m=="away3d.AWD2Parser") {',
            '    away3d.AWD2Parser = f();',
            '  }',
            '  else if (m=="away3d.Parser") {',
            '    away3d.Parser = f();',
            '  }',
            '}',
            'importScripts("'+bSrc+'");',
            'importScripts("'+pSrc+'");',

            // TODO: Don't hard-code parser name
            'var parser = new away3d.AWD2Parser();',
            'self.onmessage = function(ev) { parser.onMessage(ev); };',
            'parser.postMessage = function(msg) { self.postMessage(msg); };'
        ].join('\n');

        var BB = window.WebKitBlobBuilder || window.MozBlobBuilder;
        var URL = window.URL || window.webkitURL;
        var bb = new BB();
        bb.append(script);
        var url = URL.createObjectURL(bb.getBlob());
        var worker = new Worker(url);

        var self = this;
        worker.onmessage = function(ev) {
            var msg = ev.data;

            if (msg.command == 'asset') {
                // TODO: Consider passing this on to FileLoader to avoid including modules
                switch (msg.assetType) {
                    case 'geom':
                        var geom = new away3d.Geometry();
                        copyAssetInternalData(geom, msg.data);

                        // TODO: Reuse this
                        var evt = new away3d.Event3D('asset');
                        evt.asset = geom;
                        self.dispatchEvent(evt);
                        break;
                }
            }
            else {
                console.log('unknown message from parser worker', msg);
            }
        };

        // Send parse command
        worker.postMessage({
            command: 'parse',
            data: data
        });
    };


    Parser.prototype.onMessage = function(ev)
    {
        var msg = ev.data;
        switch (msg.command) {
            case 'parse':
                this.parse(msg.data);
        }
    };

    Parser.prototype.postMessage = function(msg)
    {
        // Overwritten by worker boot-strapping mechanism
    };


    Parser.prototype.finalizeAsset = function(type, data)
    {
        this.postMessage({
            command: 'asset',
            assetType: type,
            data: data
        });
    };


    Parser.prototype.resetData = function(data, littleEndian)
    {
        this.$.data = new DataView(data);
        this.$.littleEndian = littleEndian;
        this.$.length = data.byteLength;
    };

    Parser.prototype.hasData = function()
    {
        return (this.$.offset < this.$.length);
    };

    Parser.prototype.seek = function(delta)
    {
        this.$.offset += delta;
    };

    Parser.prototype.readInt8 = function()
    {
        return this.$.data.getInt8((this.$.offset += 1) - 1);
    };

    Parser.prototype.readUint8 = function()
    {
        return this.$.data.getUint8((this.$.offset += 1) - 1);
    };

    Parser.prototype.readInt16 = function()
    {
        return this.$.data.getInt16((this.$.offset += 2) - 2, this.$.littleEndian);
    };

    Parser.prototype.readUint16 = function()
    {
        return this.$.data.getUint16((this.$.offset += 2) - 2, this.$.littleEndian);
    };

    Parser.prototype.readInt32 = function()
    {
        return this.$.data.getInt32((this.$.offset += 4) - 4, this.$.littleEndian);
    };

    Parser.prototype.readUint32 = function()
    {
        return this.$.data.getUint32((this.$.offset += 4) - 4, this.$.littleEndian);
    };

    Parser.prototype.readFloat32 = function()
    {
        return this.$.data.getFloat32((this.$.offset += 4) - 4, true);
    };

    Parser.prototype.readFloat64 = function()
    {
        return this.$.data.getFloat64((this.$.offset += 8) - 8, true);
    };

    return Parser;
});
