/// <reference path="../../typings/tsd.d.ts" />
var BinaryOption = require('../documents/options/BinaryOption');
/**
 * Dummy quote processor :
 * - if quotes increase, ask for a Call
 * - if quotes decrease, ask for a Put
 */
var DummyProcessor = (function () {
    function DummyProcessor() {
    }
    DummyProcessor.prototype.process = function (portfolio, quote, rewards) {
        var option;
        if (this.lastQuote && this.lastQuote.close < quote.close) {
            var expiration = rewards[0].expiration;
            var payout = rewards[0].payout;
            option = {
                quote: quote,
                expiration: expiration,
                amount: 10,
                payout: payout,
                direction: BinaryOption.Direction.Call
            };
        }
        else if (this.lastQuote && this.lastQuote.close > quote.close) {
            var expiration = rewards[0].expiration;
            var payout = rewards[0].payout;
            option = {
                quote: quote,
                expiration: expiration,
                amount: 10,
                payout: payout,
                direction: BinaryOption.Direction.Put
            };
        }
        this.lastQuote = quote;
        return option;
    };
    return DummyProcessor;
})();
module.exports = DummyProcessor;
