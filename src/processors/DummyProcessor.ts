/// <reference path="../../typings/tsd.d.ts" />

import IProcessor = require('./IProcessor');
import ForexQuote = require('../quotes/ForexQuote');
import Reward = require('../options/Reward');
import BinaryOption = require('../options/BinaryOption');

/**
 * Dummy quote processor :
 * - if quotes increase, ask for a Call
 * - if quotes decrease, ask for a Put
 */
class DummyProcessor implements IProcessor<ForexQuote, BinaryOption> {
	
	private lastQuote: ForexQuote;
	
	process(quote: ForexQuote, rewards: Reward[]): BinaryOption {
		var option: BinaryOption;
		if (this.lastQuote && this.lastQuote.close < quote.close) {
			var expiration = rewards[0].expiration;
			option = new BinaryOption(expiration, 10, BinaryOption.Direction.Call);
		} else if (this.lastQuote && this.lastQuote.close > quote.close) {
			var expiration = rewards[0].expiration;
			option = new BinaryOption(expiration, 10, BinaryOption.Direction.Put);
		}
		this.lastQuote = quote;
		return option;
	}
}

export = DummyProcessor;