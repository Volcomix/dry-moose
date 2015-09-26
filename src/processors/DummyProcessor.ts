/// <reference path="../../typings/tsd.d.ts" />

import IProcessor = require('./IProcessor');
import Quote = require('../documents/Quote');
import Reward = require('../documents/Reward');
import BinaryOption = require('../documents/options/BinaryOption');

/**
 * Dummy quote processor :
 * - if quotes increase, ask for a Call
 * - if quotes decrease, ask for a Put
 */
class DummyProcessor implements IProcessor {
	
	private lastQuote: Quote;
	
	process(portfolio: number, quote: Quote, rewards: Reward[]): BinaryOption {
		var option: BinaryOption;
		if (this.lastQuote && this.lastQuote.close < quote.close) {
			var expiration = rewards[0].expiration;
			var payout = rewards[0].payout;
			option = {
				quote: quote,
				expiration: expiration,
				amount: 10,
				payout: payout,
				direction: BinaryOption.Direction.Call
			};
		} else if (this.lastQuote && this.lastQuote.close > quote.close) {
			var expiration = rewards[0].expiration;
			var payout = rewards[0].payout;
			option = {
				quote: quote,
				expiration: expiration,
				amount: 10,
				payout: payout,
				direction: BinaryOption.Direction.Put
			};
		}
		this.lastQuote = quote;
		return option;
	}
}

export = DummyProcessor;