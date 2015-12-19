/// <reference path="../../typings/tsd.d.ts" />

import Q = require('q');

import IProcessor = require('./IProcessor');
import Quote = require('../documents/Quote');
import BinaryOption = require('../documents/options/BinaryOption');

/**
 * Dummy quote processor :
 * - if quotes increase, ask for a Call
 * - if quotes decrease, ask for a Put
 */
class DummyProcessor implements IProcessor {
	
	private lastQuote: Quote;
	
	process(
		portfolio: number,
		quote: Quote,
		isPendingOption: boolean
	): Q.Promise<BinaryOption> {
		
		var option: BinaryOption;
		if (!isPendingOption && this.lastQuote) {
			if (this.lastQuote.close < quote.close) {
				option = {
					quote: quote,
					expiration: quote.rewards[0].expiration,
					amount: 10,
					payout: quote.rewards[0].payout,
					direction: BinaryOption.Direction.Call
				};
			} else if (this.lastQuote.close > quote.close) {
				option = {
					quote: quote,
					expiration: quote.rewards[0].expiration,
					amount: 10,
					payout: quote.rewards[0].payout,
					direction: BinaryOption.Direction.Put
				};
			}
		}
		this.lastQuote = quote;
		return Q(option);
	}
}

export = DummyProcessor;