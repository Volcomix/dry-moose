/// <reference path="../../typings/tsd.d.ts" />

import IQuote = require('../quotes/IQuote');
import IOption = require('../options/IOption');

abstract class AbstractProcessor<Q extends IQuote, O extends IOption> {
	abstract process(quote: Q): O;
}

export = AbstractProcessor;