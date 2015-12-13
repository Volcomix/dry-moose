/// <reference path="../../../../typings/tsd.d.ts" />
var Q = require('q');
var talib = require('talib');
function get(quotes, timePeriod, nbDev) {
    return Q.Promise(function (resolve) {
        talib.execute({
            name: 'BBANDS',
            startIdx: 0,
            endIdx: quotes.length - 1,
            inReal: quotes.map(function (quote) { return quote.close; }),
            optInTimePeriod: timePeriod,
            optInNbDevUp: nbDev,
            optInNbDevDn: nbDev,
            optInMAType: 0
        }, resolve);
    })
        .then(function (result) {
        var bband = [];
        for (var i = 0; i < result.nbElement; i++) {
            var upper = result.result.outRealUpperBand[i], middle = result.result.outRealMiddleBand[i], lower = result.result.outRealLowerBand[i];
            bband.push({
                dateTime: quotes[result.begIndex + i].dateTime,
                upper: upper, middle: middle, lower: lower,
                width: upper - lower
            });
        }
        return bband;
    });
}
exports.get = get;
