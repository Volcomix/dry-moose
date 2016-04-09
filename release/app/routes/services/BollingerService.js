"use strict";
var TA = require("../../../../build/Release/ta-lib");
function get(quotes, timePeriod, nbDev) {
    var result = TA.BBANDS(0, quotes.length - 1, quotes.map(function (quote) { return quote.close; }), timePeriod, nbDev, nbDev, 0 /* Sma */);
    var bband = [];
    for (var i = 0; i < result.outNBElement; i++) {
        var upper = result.outRealUpperBand[i], middle = result.outRealMiddleBand[i], lower = result.outRealLowerBand[i];
        bband.push({
            dateTime: quotes[result.outBegIdx + i].dateTime,
            upper: upper, middle: middle, lower: lower,
            width: upper - lower
        });
    }
    return bband;
}
exports.get = get;
