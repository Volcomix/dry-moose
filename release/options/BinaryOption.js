/// <reference path="../../typings/tsd.d.ts" />
var BinaryOption = (function () {
    function BinaryOption(expiration, amount, direction) {
        this._expiration = expiration;
        this._amount = amount;
        this._direction = direction;
    }
    Object.defineProperty(BinaryOption.prototype, "expiration", {
        get: function () {
            return this._expiration;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BinaryOption.prototype, "amount", {
        get: function () {
            return this._amount;
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
    return BinaryOption;
})();
var BinaryOption;
(function (BinaryOption) {
    (function (Direction) {
        Direction[Direction["Call"] = 0] = "Call";
        Direction[Direction["Put"] = 1] = "Put";
    })(BinaryOption.Direction || (BinaryOption.Direction = {}));
    var Direction = BinaryOption.Direction;
    ;
})(BinaryOption || (BinaryOption = {}));
module.exports = BinaryOption;
