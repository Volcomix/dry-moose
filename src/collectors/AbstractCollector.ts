/// <reference path="../../typings/tsd.d.ts" />

import IProcessor = require('../processors/IProcessor');
import IQuote = require('../quotes/IQuote');
import IOption = require('../options/IOption');

abstract class AbstractCollector {
	
	private _processor: IProcessor<IQuote, IOption>;
	
	constructor(processor: IProcessor<IQuote, IOption>) {
		this._processor = processor;
	}
	
	get processor() {
		return this._processor;
	}
	
	abstract collect();
}

export = AbstractCollector;