away3d.module('away3d.EventTarget', null,
function()
{
    var EventTarget = function()
    {
        this.$ = {
            listeners: {}
        };
    };

    var getListenerList = function(self, type)
    {
        if (!self.$.listeners.hasOwnProperty(type))
            self.$.listeners[type] = [];

        return self.$.listeners[type];
    };

    EventTarget.prototype.addEventListener = function(type, listener, useCapture)
    {
        var i, listeners = getListenerList(this, type);

        i = listeners.length;
        while (i--) {
            if (listeners[i].listener == listener && listeners[i].useCapture == useCapture)
                return;
        }

        listeners.push({
            listener: listener,
            useCapture: useCapture
        });
    };

    EventTarget.prototype.removeEventListener = function(type, listener, useCapture)
    {
        var i, listeners = getListenerList(this, type);

        i = listeners.length;
        while (i--) {
            if (listeners[i].listener == listener && listeners[i].useCapture == useCapture) {
                listeners.splice(i, 0, 1);
                return;
            }
        }
    };

    EventTarget.prototype.dispatchEvent = function(evt)
    {
        var i, len, listeners = getListenerList(this, evt.type);

        // TODO: Don't ignore evt.eventPhase
        len = listeners.length;
        for (i=0; i<len; i++) {
            listeners[i].listener.call(this, evt);
        }
    };


    return EventTarget;
});
