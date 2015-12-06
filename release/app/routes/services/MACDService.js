/// <reference path="../../../../typings/tsd.d.ts" />
var Q = require('q');
var talib = require('talib');
function get(quotes) {
    return Q.Promise(function (resolve) {
        talib.execute({
            name: 'MACD',
            startIdx: 0,
            endIdx: quotes.length - 1,
            inReal: quotes.map(function (quote) { return quote.close; }),
            optInFastPeriod: 12,
            optInSlowPeriod: 26,
            optInSignalPeriod: 9
        }, resolve);
    })
        .then(function (result) {
        var macd = [];
        for (var i = 0; i < result.nbElement; i++) {
            macd.push({
                dateTime: quotes[result.begIndex + i].dateTime,
                value: result.result.outMACD[i],
                signal: result.result.outMACDSignal[i],
                hist: result.result.outMACDHist[i]
            });
        }
        return macd;
    });
}
exports.get = get;
