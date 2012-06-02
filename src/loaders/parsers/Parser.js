away3d.module('away3d.Parser', null,
function()
{
    var Parser = function()
    {
        
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

    return Parser;
});
