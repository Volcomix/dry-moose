/// <reference path="../../typings/tsd.d.ts" />

import IProcessor = require('./IProcessor');
import Quote = require('../documents/Quote');
import BinaryOption = require('../documents/options/BinaryOption');

/**
 * Never ask for any option
 */
class NeverProcessor implements IProcessor {
	
	process(portfolio: number, quote: Quote, isPendingOption: boolean): BinaryOption {
		return null;
	}
}

export = NeverProcessor;