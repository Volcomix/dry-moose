/// <reference path="../../typings/tsd.d.ts" />

import moment = require('moment');

import IDocument = require('../database/IDocument');

abstract class AbstractQuote implements IDocument {
	
	private _dateTime: moment.Moment;
	
	constructor(dateTime: moment.Moment) {
		this._dateTime = dateTime;
	}
	
	get dateTime() {
		return this._dateTime;
	}
	
	abstract toDocument();
}

export = AbstractQuote;