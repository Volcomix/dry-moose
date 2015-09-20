/// <reference path="../../typings/tsd.d.ts" />
var BinaryOption = require('../options/BinaryOption');
var DemoInvestor = (function () {
    function DemoInvestor() {
    }
    DemoInvestor.prototype.invest = function (option) {
        if (option instanceof BinaryOption) {
            console.log({
                expiration: option.expiration.format(),
                amount: option.amount,
                direction: option.direction == BinaryOption.Direction.Call ? 'Call' : 'Put'
            });
        }
        else {
            console.error('Unknown option type');
        }
    };
    return DemoInvestor;
})();
module.exports = DemoInvestor;
