var ForexQuote = (function () {
    function ForexQuote(dateTime, open, high, low, close, volume) {
        this._dateTime = dateTime;
        this._open = open;
        this._high = high;
        this._low = low;
        this._close = close;
        this._volume = volume;
    }
    Object.defineProperty(ForexQuote.prototype, "dateTime", {
        get: function () {
            return this._dateTime;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ForexQuote.prototype, "open", {
        get: function () {
            return this._open;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ForexQuote.prototype, "high", {
        get: function () {
            return this._high;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ForexQuote.prototype, "low", {
        get: function () {
            return this._low;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ForexQuote.prototype, "close", {
        get: function () {
            return this._close;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ForexQuote.prototype, "volume", {
        get: function () {
            return this._volume;
        },
        enumerable: true,
        configurable: true
    });
    return ForexQuote;
})();
module.exports = ForexQuote;
