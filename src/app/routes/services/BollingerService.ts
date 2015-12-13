/// <reference path="../../../../typings/tsd.d.ts" />

import Q = require('q');
var talib = require('talib');

import Quote = require('../../../documents/Quote');
import BBand = require('../../../documents/BBand');

export function get(quotes: Quote[], timePeriod: number, nbDev: number) {
	return Q.Promise(function(resolve) {
		talib.execute({
			name: 'BBANDS',
			startIdx: 0,
			endIdx: quotes.length - 1,
			inReal: quotes.map(quote => quote.close),
			optInTimePeriod: timePeriod,
			optInNbDevUp: nbDev,
			optInNbDevDn: nbDev,
			optInMAType: 0
		}, resolve);
	})
	.then(function(result: any) {
		var bband: BBand[] = [];
		for (var i = 0; i < result.nbElement; i++) {
			var upper = result.result.outRealUpperBand[i],
				middle = result.result.outRealMiddleBand[i],
				lower = result.result.outRealLowerBand[i];
			bband.push({
				dateTime: quotes[result.begIndex + i].dateTime,
				upper, middle, lower,
				width: upper - lower
			});
		}
		return bband;
	});
}