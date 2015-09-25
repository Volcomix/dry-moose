/// <reference path="../../typings/tsd.d.ts" />

import Quote = require('../documents/Quote');

interface Option {
	quote: Quote;
	expiration: Date;
	amount: number;
}

export = Option;