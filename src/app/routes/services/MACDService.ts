/// <reference path="../../../../typings/tsd.d.ts" />

import Q = require('q');
var talib = require('talib');

import Quote = require('../../../documents/Quote');
import MACD = require('../../../documents/MACD');

export function get(quotes: Quote[]): Q.Promise<MACD[]> {
	return Q.Promise(function(resolve) {
		talib.execute({
			name: 'MACD',
			startIdx: 0,
			endIdx: quotes.length - 1,
			inReal: quotes.map(quote => quote.close),
			optInFastPeriod: 12,
			optInSlowPeriod: 26,
			optInSignalPeriod: 9
		}, resolve);
	})
	.then(function(result: any) {
		var macd: MACD[] = [];
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