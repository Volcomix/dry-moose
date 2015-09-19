/// <reference path="../../typings/tsd.d.ts" />

import AbstractProcessor = require('../processors/AbstractProcessor');
import IQuote = require('../quotes/IQuote');
import IOption = require('../options/IOption');

abstract class AbstractCollector {
	
	private _processor: AbstractProcessor<IQuote, IOption>;
	
	constructor(processor: AbstractProcessor<IQuote, IOption>) {
		this._processor = processor;
	}
	
	get processor() {
		return this._processor;
	}
	
	abstract collect();
}

export = AbstractCollector;