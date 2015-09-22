/// <reference path="../../typings/tsd.d.ts" />

import AbstractQuote = require('../quotes/AbstractQuote');
import AbstractOption = require('../options/AbstractOption');

/**
 * Check option result and get reward
 */
interface ICelebrator<Quote extends AbstractQuote, Option extends AbstractOption> {
    getReward(quote: Quote, option: Option);
}

export = ICelebrator;