/// <reference path="../../../../typings/tsd.d.ts" />

import Q = require('q');

import TA = require('ta-lib');

import Quote = require('../../../documents/Quote');
import MACD = require('../../../documents/MACD');

export function get(
	quotes: Quote[],
	fastPeriod: number,
	slowPeriod: number,
	signalPeriod: number
) {	
	var result = TA.MACD(
		0, quotes.length - 1,
		quotes.map(quote => quote.close),
		fastPeriod, slowPeriod, signalPeriod
	);
	var macd: MACD[] = [];
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