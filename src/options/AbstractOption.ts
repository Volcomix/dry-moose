/// <reference path="../../typings/tsd.d.ts" />

import IDocument = require('../database/IDocument');
import Quote = require('../quotes/Quote');

abstract class AbstractOption implements IDocument {
	
	private _quote: Quote;
	private _expiration: moment.Moment;
	private _amount: number;
	
	constructor(quote: Quote, expiration: moment.Moment, amount: number) {
		this._quote = quote;
		this._expiration = expiration;
		this._amount = amount;
	}
	
	get quote() {
		return this._quote;
	}
	
	get expiration() {
		return this._expiration;
	}
	
	get amount() {
		return this._amount;
	}
	
	abstract toDocument();
}

export = AbstractOption;