/// <reference path="../../typings/tsd.d.ts" />

import IDocument = require('../database/IDocument');

abstract class AbstractOption implements IDocument {
	
	private _expiration: moment.Moment;
	
	constructor(expiration: moment.Moment) {
		this._expiration = expiration;
	}
	
	get expiration() {
		return this._expiration;
	}
	
	abstract toDocument();
}

export = AbstractOption;