/// <reference path="../../typings/tsd.d.ts" />
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
    function toString(option) {
        return BinaryOption.Direction.toString(option.direction) +
            ' for ' + option.amount + '(' + option.payout + ')' +
            '$ expiring at ' + option.expiration;
    }
    BinaryOption.toString = toString;
})(BinaryOption || (BinaryOption = {}));
module.exports = BinaryOption;
