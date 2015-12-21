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
        private minMinutes: number,
		private maxMinutes: number,
		private macdOptions: VolcoProcessor.MACDOptions,
        private maCrossOptions: VolcoProcessor.MACrossOptions
	) { }
	
	process(portfolio: number, quote: Quote, isPendingOption: boolean): BinaryOption {
		
		this.closes.push(quote.close);
		
		if (this.closes.length > this.quotesCount) {
			this.closes.shift();
		} else {
			return;
		}
		
		if (isPendingOption) return;
        
        var expiration = moment(quote.rewards[0].expiration)
            .diff(moment(quote.dateTime), 'minutes');
        
        if (expiration < this.minMinutes || expiration > this.maxMinutes) return;
		
		var macd = TA.MACD(
			0, this.closes.length - 1, this.closes,
			this.macdOptions.fastPeriod,
			this.macdOptions.slowPeriod,
			this.macdOptions.signalPeriod
		);
        
        var maFast = TA.SMA(
            0, this.closes.length - 1, this.closes,
            this.maCrossOptions.fastPeriod
        );
        
        var maSlow = TA.SMA(
            0, this.closes.length - 1, this.closes,
            this.maCrossOptions.slowPeriod
        );
		
		if (macd.outNBElement < this.macdOptions.maxAfterCross) return;
		
		var hist = macd.outMACDHist[macd.outNBElement - 1],
			macdVal = macd.outMACD[macd.outNBElement - 1];
		
		if (Math.abs(hist) < this.macdOptions.minHistHeight ||
			Math.abs(hist) > this.macdOptions.maxHistHeight) return;
		
        var { maxAfterCross, minBeforeCross } = this.macdOptions,
            maxIter = maxAfterCross + minBeforeCross + 1,
            crossIdx = -1,
            crossSign = 0;
		for (var i = 2; i <= maxIter; i++) {
			var prevHist = macd.outMACDHist[macd.outNBElement - i];
			
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
                    if (i > this.macdOptions.minAfterCross) {
                        crossIdx = i;
                        crossSign = this.mathSign(prevHist);
                    } else {
                        return;
                    }
                }
                
                var histFactor = this.macdOptions.minHistRaisingFactor;
                if (Math.abs(prevHist) * histFactor > Math.abs(hist)) return;
                
                var macdFactor = this.macdOptions.minMACDRaisingFactor,
                    prevMacd = macd.outMACD[macd.outNBElement - i];
                if (Math.abs(prevMacd) * macdFactor > Math.abs(macdVal)) return;
                
                hist = prevHist;
                macdVal = prevMacd;
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
		minAfterCross: number;
		maxAfterCross: number;
		
		minHistHeight: number;
		maxHistHeight: number;
		
		minHistRaisingFactor: number;
		minMACDRaisingFactor: number;
	}
    
    export interface MACrossOptions {
        fastPeriod: number;
        slowPeriod: number;
        
        maxAfterCross: number;
    }
}

export = VolcoProcessor;