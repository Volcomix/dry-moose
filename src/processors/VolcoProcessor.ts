/// <reference path="../../typings/tsd.d.ts" />

import moment = require('moment');

import TA = require('ta-lib');

import IProcessor = require('./IProcessor');
import Quote = require('../documents/Quote');
import BinaryOption = require('../documents/options/BinaryOption');

class VolcoProcessor implements IProcessor {
	
	private closes: number[] = [];
	
	constructor(
		private minQuotes: number,
		private maxMinutes: number,
		private macdOptions: VolcoProcessor.MACDOptions
	) { }
	
	process(portfolio: number, quote: Quote, isPendingOption: boolean): BinaryOption {
		
		this.closes.push(quote.close);
		
		if (this.closes.length > this.minQuotes) {
			this.closes.shift();
		} else {
			return;
		}
		
		if (isPendingOption ||
			moment(quote.rewards[0].expiration)
			.diff(moment(quote.dateTime), 'minutes') > this.maxMinutes) return;
		
		var result = TA.MACD(
			0, this.closes.length - 1, this.closes,
			this.macdOptions.fastPeriod,
			this.macdOptions.slowPeriod,
			this.macdOptions.signalPeriod
		);
		
		if (result.outNBElement < this.macdOptions.maxHists) return;
		
		var hist = result.outMACDHist[result.outNBElement - 1],
			macd = result.outMACD[result.outNBElement - 1];
		
		if (Math.abs(hist) < this.macdOptions.minHistHeight ||
			Math.abs(hist) > this.macdOptions.maxHistHeight) return;
		
		for (var i = 2; i < this.macdOptions.maxHists; i++) {
			var prevHist = result.outMACDHist[result.outNBElement - i];
			
			if (this.mathSign(prevHist) != this.mathSign(hist)) {
				if (i > this.macdOptions.minRaisingHists) {
					return {
						quote,
						expiration: quote.rewards[0].expiration,
						amount: 10,
						payout: quote.rewards[0].payout,
						direction: prevHist > 0 ?
							BinaryOption.Direction.Put :
							BinaryOption.Direction.Call
					};
				} else {
					return;
				}
			}
			
			if (Math.abs(prevHist) > Math.abs(hist)) return;
			
			var factor = this.macdOptions.minHistRaisingFactor,
				prevMacd = result.outMACD[result.outNBElement - i];
			if (Math.abs(prevMacd) * factor > Math.abs(macd)) return;
			
			hist = prevHist;
			macd = prevMacd;
		}
	}
	
	private mathSign (x) { return ((x === 0 || isNaN(x)) ? x : (x > 0 ? 1 : -1)); }
}

module VolcoProcessor {
	export interface MACDOptions {
		fastPeriod: number;
		slowPeriod: number;
		signalPeriod: number;
		
		maxHists: number;
		
		minHistHeight: number;
		maxHistHeight: number;
		
		minRaisingHists: number;
		minHistRaisingFactor: number;
	}
}

export = VolcoProcessor;