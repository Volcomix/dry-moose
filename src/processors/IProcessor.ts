/// <reference path="../../typings/tsd.d.ts" />

import moment = require('moment');

import IQuote = require('../quotes/IQuote');
import IOption = require('../options/IOption');
import Reward = require('../options/Reward');

interface IProcessor<Q extends IQuote, O extends IOption> {
	process(quote: Q, rewards: Reward[]): O;
}

export = IProcessor;