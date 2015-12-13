/// <reference path="../../../../typings/tsd.d.ts" />
var Q = require('q');
var talib = require('talib');
function get(quotes, fastPeriod, slowPeriod) {
    return Q.all([
        Q.Promise(function (resolve) {
            talib.execute({
                name: 'SMA',
                startIdx: 0,
                endIdx: quotes.length - 1,
                inReal: quotes.map(function (quote) { return quote.close; }),
                optInTimePeriod: fastPeriod
            }, resolve);
        }),
        Q.Promise(function (resolve) {
            talib.execute({
                name: 'SMA',
                startIdx: 0,
                endIdx: quotes.length - 1,
                inReal: quotes.map(function (quote) { return quote.close; }),
                optInTimePeriod: slowPeriod
            }, resolve);
        })
    ])
        .spread(function (fastResult, slowResult) {
        var maCrosses = { fast: [], slow: [], cross: [] };
        for (var fastIdx = 0; fastIdx < fastResult.nbElement; fastIdx++) {
            var quotesIdx = fastResult.begIndex + fastIdx, slowIdx = quotesIdx - slowResult.begIndex;
            maCrosses.fast.push({
                dateTime: quotes[quotesIdx].dateTime,
                value: fastResult.result.outReal[fastIdx]
            });
            if (slowIdx >= 0) {
                maCrosses.slow.push({
                    dateTime: quotes[quotesIdx].dateTime,
                    value: slowResult.result.outReal[slowIdx]
                });
                if (slowIdx > 0) {
                    var lastFast = maCrosses.fast[fastIdx - 1].value, lastSlow = maCrosses.slow[slowIdx - 1].value, curFast = maCrosses.fast[fastIdx].value, curSlow = maCrosses.slow[slowIdx].value;
                    if (mathSign(lastFast - lastSlow) != mathSign(curFast - curSlow)) {
                        maCrosses.cross.push({
                            dateTime: quotes[quotesIdx].dateTime,
                            value: (curFast + curSlow) / 2
                        });
                    }
                }
            }
        }
        return maCrosses;
    });
}
exports.get = get;
function mathSign(x) { return ((x === 0 || isNaN(x)) ? x : (x > 0 ? 1 : -1)); }
