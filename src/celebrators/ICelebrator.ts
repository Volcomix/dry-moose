/// <reference path="../../typings/tsd.d.ts" />

import Q = require('q');

import AbstractQuote = require('../quotes/AbstractQuote');
import AbstractOption = require('../options/AbstractOption');

/**
 * Check option result and get reward
 */
interface ICelebrator<Quote extends AbstractQuote, Option extends AbstractOption> {
    getReward(quote: Quote, option: Option): Q.Promise<number>;
}

export = ICelebrator;