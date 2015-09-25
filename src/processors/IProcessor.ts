/// <reference path="../../typings/tsd.d.ts" />

import moment = require('moment');

import Quote = require('../quotes/Quote');
import Option = require('../options/Option');
import Reward = require('../options/Reward');

/**
 * Process quote and decide what option should be bought if any
 */
interface IProcessor {
	process(quote: Quote, rewards: Reward[]): Option;
}

export = IProcessor;