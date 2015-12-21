/// <reference path="../../typings/tsd.d.ts" />

import moment = require('moment');

import TA = require('ta-lib');

import IProcessor = require('./IProcessor');
import Quote = require('../documents/Quote');
import BinaryOption = require('../documents/options/BinaryOption');

class VolcoProcessor implements IProcessor {
	
	private closes: number[] = [];
	
	constructor(
		private quotesCount: number,
		private maxMinutes: number,
		private macdOptions: VolcoProcessor.MACDOptions
	) { }
	
	process(portfolio: number, quote: Quote, isPendingOption: boolean): BinaryOption {
		
		this.closes.push(quote.close);
		
		if (this.closes.length > this.quotesCount) {
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
		
		if (result.outNBElement < this.macdOptions.maxAfterCross) return;
		
		var hist = result.outMACDHist[result.outNBElement - 1],
			macd = result.outMACD[result.outNBElement - 1];
		
		if (Math.abs(hist) < this.macdOptions.minHistHeight ||
			Math.abs(hist) > this.macdOptions.maxHistHeight) return;
		
        var { maxAfterCross, minBeforeCross } = this.macdOptions,
            maxIter = maxAfterCross + minBeforeCross + 1,
            crossIdx = -1,
            crossSign = 0;
		for (var i = 2; i <= maxIter; i++) {
			var prevHist = result.outMACDHist[result.outNBElement - i];
			
            if (crossIdx > -1) {
                if (this.mathSign(prevHist) == crossSign) {
                    if (i - crossIdx >= this.macdOptions.minBeforeCross) {
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
                } else {
                    return;
                }
            } else {
                if (this.mathSign(prevHist) != this.mathSign(hist)) {
                    if (i > this.macdOptions.minRaisingHists) {
                        crossIdx = i;
                        crossSign = this.mathSign(prevHist);
                    } else {
                        return;
                    }
                }
                
                var histFactor = this.macdOptions.minHistRaisingFactor;
                if (Math.abs(prevHist) * histFactor > Math.abs(hist)) return;
                
                var macdFactor = this.macdOptions.minMACDRaisingFactor,
                    prevMacd = result.outMACD[result.outNBElement - i];
                if (Math.abs(prevMacd) * macdFactor > Math.abs(macd)) return;
                
                hist = prevHist;
                macd = prevMacd;
            }
		}
	}
	
	private mathSign (x) { return ((x === 0 || isNaN(x)) ? x : (x > 0 ? 1 : -1)); }
}

module VolcoProcessor {
	export interface MACDOptions {
		fastPeriod: number;
		slowPeriod: number;
		signalPeriod: number;
		
        minBeforeCross: number;
		maxAfterCross: number;
		
		minHistHeight: number;
		maxHistHeight: number;
		
		minRaisingHists: number;
		minHistRaisingFactor: number;
		minMACDRaisingFactor: number;
	}
}

export = VolcoProcessor;