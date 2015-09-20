/// <reference path="../../typings/tsd.d.ts" />

import Q = require('q');

import IProcessor = require('../processors/IProcessor');
import IInvestor = require('../investors/IInvestor');
import IQuote = require('../quotes/IQuote');
import Reward = require('../options/Reward');
import IOption = require('../options/IOption');

abstract class AbstractCollector {
	
	constructor(
		private processor: IProcessor<IQuote, IOption>,
		private investor: IInvestor
	) { }
	
	abstract collect(): Q.Promise<{}>;
	
	process(quote: IQuote, rewards: Reward[]) {
		var option = this.processor.process(quote, rewards);
		if (option) {
			this.investor.invest(option);
		}
	}
}

export = AbstractCollector;