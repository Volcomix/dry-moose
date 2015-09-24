/// <reference path="../../typings/tsd.d.ts" />
var Quote = (function () {
    function Quote(dateTime, open, high, low, close, volume) {
        this._dateTime = dateTime;
        this._open = open;
        this._high = high;
        this._low = low;
        this._close = close;
        this._volume = volume;
    }
    Object.defineProperty(Quote.prototype, "dateTime", {
        get: function () {
            return this._dateTime;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Quote.prototype, "open", {
        get: function () {
            return this._open;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Quote.prototype, "high", {
        get: function () {
            return this._high;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Quote.prototype, "low", {
        get: function () {
            return this._low;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Quote.prototype, "close", {
        get: function () {
            return this._close;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Quote.prototype, "volume", {
        get: function () {
            return this._volume;
        },
        enumerable: true,
        configurable: true
    });
    Quote.prototype.toDocument = function () {
        return {
            dateTime: this._dateTime.toDate(),
            open: this._open,
            high: this._high,
            low: this._low,
            close: this._close,
            volume: this._volume
        };
    };
    return Quote;
})();
module.exports = Quote;
