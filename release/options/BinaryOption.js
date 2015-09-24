/// <reference path="../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AbstractOption = require('./AbstractOption');
var BinaryOption = (function (_super) {
    __extends(BinaryOption, _super);
    function BinaryOption(quote, expiration, amount, payout, direction) {
        _super.call(this, quote, expiration, amount);
        this._payout = payout;
        this._direction = direction;
    }
    Object.defineProperty(BinaryOption.prototype, "payout", {
        get: function () {
            return this._payout;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BinaryOption.prototype, "direction", {
        get: function () {
            return this._direction;
        },
        enumerable: true,
        configurable: true
    });
    BinaryOption.prototype.toDocument = function () {
        return {
            quote: this.quote.toDocument(),
            expiration: this.expiration.toDate(),
            amount: this.amount,
            payout: this._payout,
            direction: this._direction
        };
    };
    BinaryOption.prototype.toString = function () {
        return BinaryOption.Direction.toString(this._direction) +
            ' for ' + this.amount + '(' + this._payout + ')' +
            '$ expiring at ' + this.expiration.format();
    };
    return BinaryOption;
})(AbstractOption);
var BinaryOption;
(function (BinaryOption) {
    (function (Direction) {
        Direction[Direction["Call"] = 0] = "Call";
        Direction[Direction["Put"] = 1] = "Put";
    })(BinaryOption.Direction || (BinaryOption.Direction = {}));
    var Direction = BinaryOption.Direction;
    ;
    var Direction;
    (function (Direction) {
        function toString(direction) {
            switch (direction) {
                case Direction.Call:
                    return 'Call';
                case Direction.Put:
                    return 'Put';
            }
        }
        Direction.toString = toString;
    })(Direction = BinaryOption.Direction || (BinaryOption.Direction = {}));
})(BinaryOption || (BinaryOption = {}));
module.exports = BinaryOption;
