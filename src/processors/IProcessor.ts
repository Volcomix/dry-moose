/// <reference path="../../typings/tsd.d.ts" />

import moment = require('moment');

import Quote = require('../documents/Quote');
import Option = require('../documents/Option');
import Reward = require('../documents/Reward');

/**
 * Process quote and decide what option should be bought if any
 */
interface IProcessor {
	process(quote: Quote, rewards: Reward[]): Option;
}

export = IProcessor;