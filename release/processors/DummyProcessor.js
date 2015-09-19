/// <reference path="../../typings/tsd.d.ts" />
var BinaryOption = require('../options/BinaryOption');
var DummyProcessor = (function () {
    function DummyProcessor() {
    }
    DummyProcessor.prototype.process = function (quote, rewards) {
        var option;
        if (this.lastQuote && this.lastQuote.close < quote.close) {
            var expiration = rewards[0].expiration;
            option = new BinaryOption(expiration, 10, BinaryOption.Direction.Call);
        }
        else if (this.lastQuote && this.lastQuote.close > quote.close) {
            var expiration = rewards[0].expiration;
            option = new BinaryOption(expiration, 10, BinaryOption.Direction.Put);
        }
        this.lastQuote = quote;
        return option;
    };
    return DummyProcessor;
})();
module.exports = DummyProcessor;
