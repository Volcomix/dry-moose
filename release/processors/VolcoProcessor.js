/// <reference path="../../typings/tsd.d.ts" />
var moment = require('moment');
var TA = require("../../build/Release/ta-lib");
var BinaryOption = require('../documents/options/BinaryOption');
var VolcoProcessor = (function () {
    function VolcoProcessor() {
        this.closes = [];
    }
    VolcoProcessor.prototype.process = function (portfolio, quote, isPendingOption) {
        this.closes.push(quote.close);
        if (this.closes.length > 60) {
            this.closes.shift();
        }
        else {
            return;
        }
        if (isPendingOption ||
            moment(quote.rewards[0].expiration)
                .diff(moment(quote.dateTime), 'minutes') > 60) {
            return;
        }
        var result = TA.MACD(0, this.closes.length - 1, this.closes, 12, 26, 9);
        if (result.outNBElement < 15)
            return;
        var hist = result.outMACDHist[result.outNBElement - 1], macd = result.outMACD[result.outNBElement - 1];
        if (Math.abs(hist) < 0.0001)
            return;
        for (var i = 2; i < 15; i++) {
            var prevHist = result.outMACDHist[result.outNBElement - i];
            if (this.mathSign(prevHist) != this.mathSign(hist) && i > 2) {
                return {
                    quote: quote,
                    expiration: quote.rewards[0].expiration,
                    amount: 10,
                    payout: quote.rewards[0].payout,
                    direction: prevHist > 0 ?
                        BinaryOption.Direction.Put :
                        BinaryOption.Direction.Call
                };
            }
            if (Math.abs(prevHist) > Math.abs(hist))
                return;
            var prevMacd = result.outMACD[result.outNBElement - i];
            if (Math.abs(prevMacd) * 0.8 > Math.abs(macd))
                return;
            hist = prevHist;
            macd = prevMacd;
        }
    };
    VolcoProcessor.prototype.mathSign = function (x) { return ((x === 0 || isNaN(x)) ? x : (x > 0 ? 1 : -1)); };
    return VolcoProcessor;
})();
module.exports = VolcoProcessor;
