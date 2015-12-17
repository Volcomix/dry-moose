/// <reference path="../../../../typings/tsd.d.ts" />
var TA = require("../../../../build/Release/ta-lib");
function get(quotes, fastPeriod, slowPeriod, signalPeriod) {
    var result = TA.MACD(0, quotes.length - 1, quotes.map(function (quote) { return quote.close; }), fastPeriod, slowPeriod, signalPeriod);
    var macd = [];
    for (var i = 0; i < result.outNBElement; i++) {
        macd.push({
            dateTime: quotes[result.outBegIdx + i].dateTime,
            value: result.outMACD[i],
            signal: result.outMACDSignal[i],
            hist: result.outMACDHist[i]
        });
    }
    return macd;
}
exports.get = get;
