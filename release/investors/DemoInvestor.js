/// <reference path="../../typings/tsd.d.ts" />
var DemoInvestor = (function () {
    function DemoInvestor() {
    }
    DemoInvestor.prototype.invest = function (option) {
        console.log(option);
    };
    return DemoInvestor;
})();
module.exports = DemoInvestor;
