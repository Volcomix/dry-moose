/// <reference path="../../typings/tsd.d.ts" />
var Q = require('q');
var moment = require('moment');
var TA = require("../../build/Release/ta-lib");
var DbManager = require('../database/DbManager');
var BinaryOption = require('../documents/options/BinaryOption');
var VolcoProcessor = (function () {
    function VolcoProcessor() {
    }
    VolcoProcessor.prototype.process = function (portfolio, quote, isPendingOption) {
        var _this = this;
        if (isPendingOption ||
            moment(quote.rewards[0].expiration)
                .diff(moment(quote.dateTime), 'minutes') > 40) {
            return Q(null);
        }
        return Q.ninvoke(DbManager.db.collection('quotes'), 'aggregate', [
            { $sort: { dateTime: -1 } },
            { $limit: 60 },
            { $sort: { dateTime: 1 } },
            { $project: { _id: 0, dateTime: 1, close: 1 } }
        ])
            .then(function (quotes) {
            if (quotes.length < 60)
                return;
            var result = TA.MACD(0, quotes.length - 1, quotes.map(function (quote) { return quote.close; }), 12, 26, 9);
            if (result.outNBElement < 15)
                return;
            var hist = result.outMACDHist[result.outNBElement - 1], macd = result.outMACD[result.outNBElement - 1];
            if (Math.abs(hist) < 0.00005)
                return;
            for (var i = 2; i < 15; i++) {
                var prevHist = result.outMACDHist[result.outNBElement - i];
                if (_this.mathSign(prevHist) != _this.mathSign(hist) && i > 3) {
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
                if (Math.abs(prevMacd) * 1.5 > Math.abs(macd))
                    return;
                hist = prevHist;
                macd = prevMacd;
            }
        });
    };
    VolcoProcessor.prototype.mathSign = function (x) { return ((x === 0 || isNaN(x)) ? x : (x > 0 ? 1 : -1)); };
    return VolcoProcessor;
})();
module.exports = VolcoProcessor;
