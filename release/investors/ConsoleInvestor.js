/// <reference path="../../typings/tsd.d.ts" />
var BinaryOption = require('../options/BinaryOption');
var ConsoleInvestor = (function () {
    function ConsoleInvestor() {
    }
    ConsoleInvestor.prototype.invest = function (option) {
        if (option instanceof BinaryOption) {
            console.log(BinaryOption.Direction.toString(option.direction) +
                ' for ' + option.amount + '$ expiring at ' + option.expiration.format());
        }
        else {
            console.error('Unknown option type');
        }
    };
    return ConsoleInvestor;
})();
module.exports = ConsoleInvestor;
