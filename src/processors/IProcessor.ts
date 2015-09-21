/// <reference path="../../typings/tsd.d.ts" />

import moment = require('moment');

import IQuote = require('../quotes/IQuote');
import IOption = require('../options/IOption');
import Reward = require('../options/Reward');

/**
 * Process quote and decide what option should be bought if any
 */
interface IProcessor<Quote extends IQuote, Option extends IOption> {
	process(quote: Quote, rewards: Reward[]): Option;
}

export = IProcessor;