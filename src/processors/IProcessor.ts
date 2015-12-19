/// <reference path="../../typings/tsd.d.ts" />

import Q = require('q');

import Quote = require('../documents/Quote');
import Option = require('../documents/options/Option');

/**
 * Process quote and decide what option should be bought if any
 */
interface IProcessor {
	process(
		portfolio: number,
		quote: Quote,
		isPendingOption: boolean
	): Q.Promise<Option>;
}

export = IProcessor;