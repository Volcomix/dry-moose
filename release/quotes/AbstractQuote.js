/// <reference path="../../typings/tsd.d.ts" />
var AbstractQuote = (function () {
    function AbstractQuote(dateTime) {
        this._dateTime = dateTime;
    }
    Object.defineProperty(AbstractQuote.prototype, "dateTime", {
        get: function () {
            return this._dateTime;
        },
        enumerable: true,
        configurable: true
    });
    return AbstractQuote;
})();
module.exports = AbstractQuote;
