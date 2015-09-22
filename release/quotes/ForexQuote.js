/// <reference path="../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AbstractQuote = require('./AbstractQuote');
var ForexQuote = (function (_super) {
    __extends(ForexQuote, _super);
    function ForexQuote(dateTime, open, high, low, close, volume) {
        _super.call(this, dateTime);
        this._open = open;
        this._high = high;
        this._low = low;
        this._close = close;
        this._volume = volume;
    }
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
    ForexQuote.prototype.toDocument = function () {
        return {
            dateTime: this.dateTime.toDate(),
            open: this._open,
            high: this._high,
            low: this._low,
            close: this._close,
            volume: this._volume
        };
    };
    return ForexQuote;
})(AbstractQuote);
module.exports = ForexQuote;
