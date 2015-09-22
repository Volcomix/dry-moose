/// <reference path="../../typings/tsd.d.ts" />
var AbstractOption = (function () {
    function AbstractOption(expiration) {
        this._expiration = expiration;
    }
    Object.defineProperty(AbstractOption.prototype, "expiration", {
        get: function () {
            return this._expiration;
        },
        enumerable: true,
        configurable: true
    });
    return AbstractOption;
})();
module.exports = AbstractOption;
