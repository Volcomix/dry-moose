/// <reference path="../../typings/tsd.d.ts" />

import AbstractProcessor = require('./AbstractProcessor');
import ForexQuote = require('../quotes/ForexQuote');
import BinaryOption = require('../options/BinaryOption');

class DummyProcessor extends AbstractProcessor<ForexQuote, BinaryOption> {
	
	private lastQuote: ForexQuote;
	
	process(quote: ForexQuote): BinaryOption {
		
        console.log(quote.dateTime.format() + " => " + quote.close);
			
		var option: BinaryOption;
		if (this.lastQuote && this.lastQuote.close < quote.close) {
			option = BinaryOption.Call;
		} else if (this.lastQuote && this.lastQuote.close > quote.close) {
			option = BinaryOption.Put;
		} else {
			option = BinaryOption.None;
		}
		this.lastQuote = quote;
		return option;
	}
}

export = DummyProcessor;