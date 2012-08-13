away3d.module('away3d.Parser', [
    'away3d.EventTarget',
    'away3d.Event3D',
    'away3d.DefaultMaterial',
    'away3d.TextureMethod',
    'away3d.ImageTexture',
    'away3d.Geometry',
    'away3d.Mesh',
    'away3d.Matrix3D'
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
        this.$.finalizedAssets = [];
        this.$.paused = false;
    };


    if (away3d.EventTarget) {
        Parser.prototype = new away3d.EventTarget();
        Parser.prototype.constructor = Parser;
    }


    Parser.prototype.parseAsync = function(data)
    {
        if (this.forceSingleThreaded) {
            // TODO: Implement green-threading
            this.parse(data);
        }
        else {
            try {
                var worker = initWorker(this.constructor);

                var self = this;
                worker.onmessage = function(ev) {
                    var msg = ev.data;
                    self.onWorkerMessage(msg);
                };

                // Send parse command
                worker.postMessage({
                    command: 'parse',
                    data: data
                });
            }
            catch (err) {
                // Initializing and starting the worker failed, so
                // revert to single-threaded parsing after all.
                // TODO: Implement green-threading
                this.parse(data);
            }
        }
    };


    Parser.prototype.parse = function(data)
    {
        this.resetData(data, true); // TODO: Make endianess configurable
        this.proceedParsing();
    };


    Parser.prototype.shouldContinue = function()
    {
        return !this.$.paused;
    };


    Parser.prototype.pauseAndRetrieveDependencies = function()
    {
        this.$.paused = true;
    };


    Parser.prototype.resumeAfterDependencies = function()
    {
        this.$.paused = false;
        this.proceedParsing();
    };


    Parser.prototype.onMessage = function(ev)
    {
        var msg = ev.data;
        switch (msg.command) {
            case 'parse':
                this.parse(msg.data);
                self.close();
                break;
        }
    };

    Parser.prototype.onWorkerMessage = function(msg)
    {
        if (msg.command == 'asset') {
            var asset;

            // TODO: Consider passing this on to FileLoader to avoid including modules
            switch (msg.assetType) {
                case 'geom':
                    asset = finalizeGeometry(msg);
                    break;
                
                case 'mesh':
                    asset = finalizeMesh(msg, this.$.finalizedAssets);
                    break;

                case 'material':
                    asset = finalizeMaterial(msg, this.$.finalizedAssets);
                    break;
                
                case 'texture':
                    asset = finalizeTexture(msg);
                    break;
            }

            if (msg.id && asset) {
                this.$.finalizedAssets[msg.id] = asset;

                var evt = new away3d.Event3D('asset');
                evt.asset = asset;
                this.dispatchEvent(evt);
            }
        }
        else {
            console.log('unknown message from parser worker', msg);
        }
    };

    Parser.prototype.postMessage = function(msg)
    {
        // Just forward message directly to the handler method belong
        // to this instance. This is overwritten by worker boot-strapping
        // mechanism to instead post worker message.
        this.onWorkerMessage(msg);
    };


    Parser.prototype.finalizeAsset = function(type, data, id)
    {
        this.postMessage({
            command: 'asset',
            assetType: type,
            id: id,
            data: data
        });
    };


    Parser.prototype.resetData = function(data, littleEndian)
    {
        try {
            this.$.data = new DataView(data)
        } catch (err) {
            this.$.data = new FFDataView(data);
        }

        this.$.buffer = data;
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


    var finalizeGeometry = function(msg)
    {
        var asset = new away3d.Geometry();
        asset.$.vertexData = msg.data.vertexData;
        asset.$.indexData = msg.data.indexData;
        asset.$.colorData = msg.data.colorData;
        asset.$.uvData = msg.data.uvData;

        return asset;
    };

    
    var finalizeMesh = function(msg, finalizedAssets)
    {
        var geom = resolveAsset(msg.data.geometry, finalizedAssets),
            mtl = resolveAsset(msg.data.material, finalizedAssets),
            par = resolveAsset(msg.data.parent, finalizedAssets),
            asset;
            
        asset = new away3d.Mesh(geom, mtl);
        asset.transform = new away3d.Matrix3D(msg.data.transform);

        if (par) {
            par.appendChild(asset);
        }

        // TODO: Implement transform matrix

        return asset;
    };


    var finalizeMaterial = function(msg, finalizedAssets)
    {
        var asset = new away3d.DefaultMaterial;

        if (msg.data.texture) {
            var tex = resolveAsset(msg.data.texture, finalizedAssets);

            asset.addMethod(new away3d.TextureMethod(tex));
        }
        else {
        }

        return asset;
    };


    var finalizeTexture = function(msg)
    {
        var asset = new away3d.ImageTexture(msg.data);

        return asset;
    };


    var resolveAsset = function(id, finalizedAssets)
    {
        if (id) {
            return finalizedAssets[id];
        }

        return null;
    };


    var initWorker = function(parserConstructor)
    {
        var loc = String(document.location).substr(0, String(document.location).lastIndexOf('/'));
        var bSrc = loc + '/' + away3d.originOfModule(Parser);
        var pSrc = loc + '/' + away3d.originOfModule(parserConstructor);
        var allSrc = [bSrc];

        if (pSrc != bSrc)
            allSrc.push(pSrc);

        parsers = allSrc.join('","');

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
            'importScripts("'+parsers+'");',

            // TODO: Don't hard-code parser name
            'var parser = new away3d.AWD2Parser();',
            'self.onmessage = function(ev) { parser.onMessage(ev); };',
            'parser.postMessage = function(msg) { self.postMessage(msg); };'
        ].join('\n');

        var URL, BB, blob, url, worker;

        URL = window.URL || window.webkitURL;
        BB = window.WebKitBlobBuilder || window.MozBlobBuilder;
        if (BB) {
            var bb = new BB();
            bb.append(script);
            blob = bb.getBlob();
        }
        else {
            blob = new Blob([script]);
        }
        url = URL.createObjectURL(blob);
        
        return new Worker(url);
    }


    /**
     * Helper class that simulates a DataView for browsers that do not
     * support it natively, but do supported typed arrays (Firefox.)
    */
    var FFDataView = function(arrayBuffer)
    {
        // Because firefox is faster with instance methods and closures,
        // and this is not a type that will be heavily instantiated, but
        // that will however need to have fast-executing instance methods,
        // it makes sense to make an exception and use this pattern here.

        var buf20, buf21,
            buf40, buf41, buf42, buf43;

        var slice = function(offs, fieldLength)
        {
            var bufLen = arrayBuffer.byteLength,
                end = bufLen - (bufLen % fieldLength) + offs;

            if (end > bufLen)
                end -= fieldLength;

            return arrayBuffer.slice(offs, end);
        };

        buf20 = slice(0, 2);
        buf21 = slice(1, 2);

        buf40 = slice(0, 4);
        buf41 = slice(1, 4);
        buf42 = slice(2, 4);
        buf43 = slice(3, 4);

        var i8 = new Uint8Array(arrayBuffer);
        var ui8 = new Int8Array(arrayBuffer);

        var i16 = [
            new Int16Array(buf20),
            new Int16Array(buf21)
        ];

        var ui16 = [
            new Uint16Array(buf20),
            new Uint16Array(buf21)
        ];

        var i32 = [
            new Int32Array(buf40),
            new Int32Array(buf41),
            new Int32Array(buf42),
            new Int32Array(buf43)
        ];

        var ui32 = [
            new Uint32Array(buf40),
            new Uint32Array(buf41),
            new Uint32Array(buf42),
            new Uint32Array(buf43)
        ];

        var f32 = [
            new Float32Array(buf40),
            new Float32Array(buf41),
            new Float32Array(buf42),
            new Float32Array(buf43)
        ];

        var f64 = [
            new Float32Array(slice(0, 8)),
            new Float32Array(slice(1, 8)),
            new Float32Array(slice(2, 8)),
            new Float32Array(slice(3, 8)),
            new Float32Array(slice(4, 8)),
            new Float32Array(slice(5, 8)),
            new Float32Array(slice(6, 8)),
            new Float32Array(slice(7, 8))
        ];

        var getMultibyte = function(typedArray, offset, fieldLength)
        {
            var arr = offset % fieldLength,
                idx = (offset-arr) / fieldLength,
                val = typedArray[arr][idx];

            offset += fieldLength;
            return val;
        };


        this.getInt8 = function(offset)
        {
            return i8[offset];
        };

        this.getUint8 = function(offset)
        {
            return ui8[offset];
        };

        this.getInt16 = function(offset)
        {
            return getMultibyte(i16, offset, 2);
        };

        this.getUint16 = function(offset)
        {
            return getMultibyte(ui16, offset, 2);
        };

        this.getInt32 = function(offset)
        {
            return getMultibyte(i32, offset, 4);
        };

        this.getUint32 = function(offset)
        {
            return getMultibyte(ui32, offset, 4);
        };

        this.getFloat32 = function(offset)
        {
            return getMultibyte(f32, offset, 4);
        };

        this.getFloat64 = function(offset)
        {
            return getMultibyte(f64, offset, 8);
        };
    };




    return Parser;
});
