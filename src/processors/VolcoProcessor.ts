/// <reference path="../../typings/tsd.d.ts" />

import Q = require('q');
import moment = require('moment');

import TA = require('ta-lib');

import DbManager = require('../database/DbManager');
import IProcessor = require('./IProcessor');
import Quote = require('../documents/Quote');
import BinaryOption = require('../documents/options/BinaryOption');

class VolcoProcessor implements IProcessor {
	
	process(
		portfolio: number,
		quote: Quote,
		isPendingOption: boolean
	): Q.Promise<BinaryOption> {
		
		if (isPendingOption ||
			moment(quote.rewards[0].expiration)
			.diff(moment(quote.dateTime), 'minutes') > 40
		) {
			return Q<BinaryOption>(null);
		}
		
		return Q.ninvoke(DbManager.db.collection('quotes'), 'aggregate', [
			{ $sort: { dateTime: -1 }},
			{ $limit: 60 },
			{ $sort: { dateTime: 1 }},
			{ $project: { _id: 0, dateTime: 1, close: 1 }}
		])
		.then((quotes: Quote[]) => {
			if (quotes.length < 60) return;
			
			var result = TA.MACD(0, quotes.length - 1,
				quotes.map(quote => quote.close),
				12, 26, 9
			);
			
			if (result.outNBElement < 15) return;
			
			var hist = result.outMACDHist[result.outNBElement - 1],
				macd = result.outMACD[result.outNBElement - 1];
			
			if (Math.abs(hist) < 0.00005) return;
			
			for (var i = 2; i < 15; i++) {
				var prevHist = result.outMACDHist[result.outNBElement - i];
				
				if (this.mathSign(prevHist) != this.mathSign(hist) && i > 3) {
					return {
						quote,
						expiration: quote.rewards[0].expiration,
						amount: 10,
						payout: quote.rewards[0].payout,
						direction: prevHist > 0 ?
							BinaryOption.Direction.Put :
							BinaryOption.Direction.Call
					};
				}
				
				if (Math.abs(prevHist) > Math.abs(hist)) return;
				
				var prevMacd = result.outMACD[result.outNBElement - i];
				if (Math.abs(prevMacd) * 1.5 > Math.abs(macd)) return;
				
				hist = prevHist;
				macd = prevMacd;
			}
		});
	}
	
	private mathSign (x) { return ((x === 0 || isNaN(x)) ? x : (x > 0 ? 1 : -1)); }
}

export = VolcoProcessor;