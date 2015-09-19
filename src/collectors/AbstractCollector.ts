/// <reference path="../../typings/tsd.d.ts" />

import IProcessor = require('../processors/IProcessor');
import IInvestor = require('../investors/IInvestor');
import IQuote = require('../quotes/IQuote');
import IOption = require('../options/IOption');

abstract class AbstractCollector {
	
	private _processor: IProcessor<IQuote, IOption>;
	private _investor: IInvestor;
	
	constructor(processor: IProcessor<IQuote, IOption>, investor: IInvestor) {
		this._processor = processor;
		this._investor = investor;
	}
	
	get processor() {
		return this._processor;
	}
	
	get investor() {
		return this._investor;
	}
	
	abstract collect();
}

export = AbstractCollector;