/// <reference path="../../../../typings/tsd.d.ts" />
var TA = require("../../../../build/Release/ta-lib");
function get(quotes, fastPeriod, slowPeriod) {
    var fastResult = TA.SMA(0, quotes.length - 1, quotes.map(function (quote) { return quote.close; }), fastPeriod);
    var slowResult = TA.SMA(0, quotes.length - 1, quotes.map(function (quote) { return quote.close; }), slowPeriod);
    var maCrosses = { fast: [], slow: [], cross: [] };
    for (var fastIdx = 0; fastIdx < fastResult.outNBElement; fastIdx++) {
        var quotesIdx = fastResult.outBegIdx + fastIdx, slowIdx = quotesIdx - slowResult.outBegIdx;
        maCrosses.fast.push({
            dateTime: quotes[quotesIdx].dateTime,
            value: fastResult.outReal[fastIdx]
        });
        if (slowIdx >= 0) {
            maCrosses.slow.push({
                dateTime: quotes[quotesIdx].dateTime,
                value: slowResult.outReal[slowIdx]
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
}
exports.get = get;
function mathSign(x) { return ((x === 0 || isNaN(x)) ? x : (x > 0 ? 1 : -1)); }
