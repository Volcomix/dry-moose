"use strict";
var BinaryOption = require('../documents/options/BinaryOption');
/**
 * Dummy quote processor :
 * - if quotes increase, ask for a Call
 * - if quotes decrease, ask for a Put
 */
var DummyProcessor = (function () {
    function DummyProcessor() {
    }
    DummyProcessor.prototype.process = function (portfolio, quote, isPendingOption) {
        var option;
        if (!isPendingOption && this.lastQuote) {
            if (this.lastQuote.close < quote.close) {
                option = {
                    quote: quote,
                    expiration: quote.rewards[0].expiration,
                    amount: 10,
                    payout: quote.rewards[0].payout,
                    direction: BinaryOption.Direction.Call
                };
            }
            else if (this.lastQuote.close > quote.close) {
                option = {
                    quote: quote,
                    expiration: quote.rewards[0].expiration,
                    amount: 10,
                    payout: quote.rewards[0].payout,
                    direction: BinaryOption.Direction.Put
                };
            }
        }
        this.lastQuote = quote;
        return option;
    };
    return DummyProcessor;
}());
module.exports = DummyProcessor;
