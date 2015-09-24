/// <reference path="../../typings/tsd.d.ts" />

import Quote = require('../quotes/Quote');

interface AbstractOption {
	quote: Quote;
	expiration: Date;
	amount: number;
}

export = AbstractOption;