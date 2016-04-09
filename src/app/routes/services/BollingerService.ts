import Q = require('q');

import TA = require('ta-lib');

import Quote = require('../../../documents/Quote');
import BBand = require('../../../documents/BBand');

export function get(quotes: Quote[], timePeriod: number, nbDev: number) {
	var result = TA.BBANDS(
		0, quotes.length - 1,
		quotes.map(quote => quote.close),
		timePeriod, nbDev, nbDev, TA.MAType.Sma
	);
	var bband: BBand[] = [];
	for (var i = 0; i < result.outNBElement; i++) {
		var upper = result.outRealUpperBand[i],
			middle = result.outRealMiddleBand[i],
			lower = result.outRealLowerBand[i];
		bband.push({
			dateTime: quotes[result.outBegIdx + i].dateTime,
			upper, middle, lower,
			width: upper - lower
		});
	}
	return bband;
}