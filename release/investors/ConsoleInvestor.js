/// <reference path="../../typings/tsd.d.ts" />
var ConsoleInvestor = (function () {
    function ConsoleInvestor() {
    }
    ConsoleInvestor.prototype.invest = function (option) {
        console.log(option.toString());
    };
    return ConsoleInvestor;
})();
module.exports = ConsoleInvestor;
