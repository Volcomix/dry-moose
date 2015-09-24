/// <reference path="../../typings/tsd.d.ts" />

import moment = require('moment');

import Quote = require('../quotes/Quote');
import AbstractOption = require('../options/AbstractOption');
import Reward = require('../options/Reward');

/**
 * Process quote and decide what option should be bought if any
 */
interface IProcessor<Option extends AbstractOption> {
	process(quote: Quote, rewards: Reward[]): Option;
}

export = IProcessor;