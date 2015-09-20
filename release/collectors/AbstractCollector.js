/// <reference path="../../typings/tsd.d.ts" />
var AbstractCollector = (function () {
    function AbstractCollector(processor, investor) {
        this.processor = processor;
        this.investor = investor;
    }
    AbstractCollector.prototype.process = function (quote, rewards) {
        var option = this.processor.process(quote, rewards);
        if (option) {
            this.investor.invest(option);
        }
    };
    return AbstractCollector;
})();
module.exports = AbstractCollector;
