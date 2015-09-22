/// <reference path="../../typings/tsd.d.ts" />

import moment = require('moment');

import AbstractQuote = require('../quotes/AbstractQuote');
import AbstractOption = require('../options/AbstractOption');
import Reward = require('../options/Reward');

/**
 * Process quote and decide what option should be bought if any
 */
interface IProcessor<Quote extends AbstractQuote, Option extends AbstractOption> {
	process(quote: Quote, rewards: Reward[]): Option;
}

export = IProcessor;