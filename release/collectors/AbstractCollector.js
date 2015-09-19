/// <reference path="../../typings/tsd.d.ts" />
var AbstractCollector = (function () {
    function AbstractCollector(processor) {
        this._processor = processor;
    }
    Object.defineProperty(AbstractCollector.prototype, "processor", {
        get: function () {
            return this._processor;
        },
        enumerable: true,
        configurable: true
    });
    return AbstractCollector;
})();
module.exports = AbstractCollector;
