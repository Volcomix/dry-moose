/// <reference path="../../typings/tsd.d.ts" />

import Quote = require('../quotes/Quote');

interface Option {
	quote: Quote;
	expiration: Date;
	amount: number;
}

export = Option;