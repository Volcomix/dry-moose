/// <reference path="../../typings/tsd.d.ts" />
var AbstractCollector = (function () {
    function AbstractCollector(processor, investor) {
        this._processor = processor;
        this._investor = investor;
    }
    Object.defineProperty(AbstractCollector.prototype, "processor", {
        get: function () {
            return this._processor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractCollector.prototype, "investor", {
        get: function () {
            return this._investor;
        },
        enumerable: true,
        configurable: true
    });
    return AbstractCollector;
})();
module.exports = AbstractCollector;
