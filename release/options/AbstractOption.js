/// <reference path="../../typings/tsd.d.ts" />
var AbstractOption = (function () {
    function AbstractOption(quote, expiration, amount) {
        this._quote = quote;
        this._expiration = expiration;
        this._amount = amount;
    }
    Object.defineProperty(AbstractOption.prototype, "quote", {
        get: function () {
            return this._quote;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractOption.prototype, "expiration", {
        get: function () {
            return this._expiration;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractOption.prototype, "amount", {
        get: function () {
            return this._amount;
        },
        enumerable: true,
        configurable: true
    });
    return AbstractOption;
})();
module.exports = AbstractOption;
