/// <reference path="../../typings/tsd.d.ts" />

import moment = require('moment');

import IProcessor = require('./IProcessor');
import Quote = require('../quotes/Quote');
import Reward = require('../options/Reward');
import BinaryOption = require('../options/BinaryOption');

/**
 * Dummy quote processor :
 * - if quotes increase, ask for a Call
 * - if quotes decrease, ask for a Put
 */
class DummyProcessor implements IProcessor<BinaryOption> {
	
	private lastQuote: Quote;
	
	process(quote: Quote, rewards: Reward[]): BinaryOption {
		var option: BinaryOption;
		if (this.lastQuote && this.lastQuote.close < quote.close) {
			var expiration = rewards[0].expiration;
			var payout = rewards[0].payout;
			option = new BinaryOption(
				quote,
				moment(expiration),
				10,
				payout,
				BinaryOption.Direction.Call);
		} else if (this.lastQuote && this.lastQuote.close > quote.close) {
			var expiration = rewards[0].expiration;
			var payout = rewards[0].payout;
			option = new BinaryOption(
				quote,
				moment(expiration),
				10,
				payout,
				BinaryOption.Direction.Put
			);
		}
		this.lastQuote = quote;
		return option;
	}
}

export = DummyProcessor;