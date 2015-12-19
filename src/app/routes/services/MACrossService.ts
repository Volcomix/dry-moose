/// <reference path="../../../../typings/tsd.d.ts" />

import Q = require('q');

import TA = require('ta-lib');

import Quote = require('../../../documents/Quote');
import MonitoringData = require('../../../documents/MonitoringData');
import MACross = require('../../../documents/MACross');

export function get(quotes: Quote[], fastPeriod: number, slowPeriod: number) {
	var fastResult = TA.SMA(
		0, quotes.length - 1,
		quotes.map(quote => quote.close),
		fastPeriod
	);
	var slowResult = TA.SMA(
		0,
		quotes.length - 1,
		quotes.map(quote => quote.close),
		slowPeriod
	);
	var maCrosses: MACross = { fast: [], slow: [], cross: [] };
	for (var fastIdx = 0; fastIdx < fastResult.outNBElement; fastIdx++) {
		var quotesIdx = fastResult.outBegIdx + fastIdx,
			slowIdx = quotesIdx - slowResult.outBegIdx;
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
				var lastFast = maCrosses.fast[fastIdx - 1].value,
					lastSlow = maCrosses.slow[slowIdx - 1].value,
					curFast = maCrosses.fast[fastIdx].value,
					curSlow = maCrosses.slow[slowIdx].value;
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

function mathSign (x) { return ((x === 0 || isNaN(x)) ? x : (x > 0 ? 1 : -1)); }