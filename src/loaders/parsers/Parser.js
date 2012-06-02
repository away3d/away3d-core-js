away3d.module('away3d.Parser', null,
function()
{
    var Parser = function()
    {
        this.$ = {
            offset: 0,
            length: 0,
            littleEndian: true,
            data: null
        };
    };


    Parser.prototype.parseAsync = function(data)
    {
        var loc = String(document.location).substr(0, String(document.location).lastIndexOf('/'));
        var bSrc = loc + '/' + away3d.originOfModule(Parser);
        var pSrc = loc + '/' + away3d.originOfModule(this.constructor);
        // TODO: Check so bSrc != pSrc (which it will be when library is concatenated together)
        var script = [
            'var ParserType;',
            'var away3d = {};',
            // TODO: Consider way to make this independent of module format
            'away3d.module = function(m,d,f) {',
            '  if (m=="away3d.AWD2Parser") {',
            '    ParserType = f();',
            '  }',
            '  else if (m=="away3d.Parser") {',
            '    away3d.Parser = f();',
            '  }',
            '}',
            'importScripts("'+bSrc+'");',
            'importScripts("'+pSrc+'");',
            'var parser = new ParserType();',
            'self.onmessage = function(ev) { parser.onMessage(ev); };',
            'parser.postMessage = function(msg) { self.postMessage(msg); };'
        ].join('\n');

        var BB = window.WebKitBlobBuilder || window.MozBlobBuilder;
        var URL = window.URL || window.webkitURL;
        var bb = new BB();
        bb.append(script);
        var url = URL.createObjectURL(bb.getBlob());
        var worker = new Worker(url);

        worker.onmessage = function(ev) {
            // Properly handle different messages
            console.log('worker said', ev.data);
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
