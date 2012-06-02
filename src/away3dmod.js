var away3d = away3d || {};

(function() {
    var loading = {};
    var included = {};

    away3d.MODULE_ROOT = away3d.MODULE_ROOT || '';

    away3d.resolveModule = function(module)
    {
        var src = module;
        if (module.indexOf('away3d.')==0) {
            src = module.substr(7)+'.js';

            if (away3d.MODULE_ROOT) {
                src = away3d.MODULE_ROOT + '/' + src;
            }
        }

        return src;
    };

    away3d.originOfModule = function(object)
    {
        var module;

        for (module in included) {
            if (included[module].object == object)
                return included[module].src;
        }
    };

    away3d.module = function(module, dependencies, factory)
    {
        var names = module.split('.');
        var i, len = names.length-1;

        included[module] = {
            object: null, // Set further down
            src: loading[module].src
        };

        away3d.include(dependencies, function() {
            var par = window;
            for (i=0; i<len; i++) {
                var name = names[i];
                if (!par.hasOwnProperty(name)) {
                    par[name] = {};
                }

                par = par[name];
            }

            var obj = factory();

            par[names[names.length-1]] = obj;
            included[module].object = obj;

            if (loading.hasOwnProperty(module)) {
                var callback = loading[module].callback;
                delete loading[module];
                callback();
            }
        });
    };

    away3d.include = function(imports, callback)
    {
        if (imports instanceof Array) {
            var i, len = imports.length;

            if (len) {
                var include = function(index) {
                    away3d.include(imports[index], function() {
                        index++;
                        if (index < len) {
                            include(index);
                        }
                        else {
                            callback();
                        }
                    });
                };

                include(0);
            }
            else {
                // List of dependencies was empty
                callback();
                return;
            }
        }
        else if (imports == null) {
            callback();
            return;
        }
        else {
            if (!included.hasOwnProperty(imports)) {
                var src = away3d.resolveModule(imports);

                var element = document.createElement('script');
                element.setAttribute('src', src);
                document.getElementsByTagName('head')[0].appendChild(element);

                loading[imports] = {
                    name: imports,
                    src: src,
                    callback: callback
                };
            }
            else {
                callback();
                return;
            }
        }
    };
})();

