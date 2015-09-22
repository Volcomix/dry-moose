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
    BinaryOption.prototype.toDocument = function () {
        return {
            expiration: this._expiration.toDate(),
            amount: this._amount,
            direction: this._direction
        };
    };
    BinaryOption.prototype.toString = function () {
        return BinaryOption.Direction.toString(this.direction) +
            ' for ' + this.amount + '$ expiring at ' + this.expiration.format();
    };
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
