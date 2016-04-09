import Quote = require('../Quote');

interface Option {
	quote: Quote;
	expiration: Date;
	amount: number;
}

export = Option;