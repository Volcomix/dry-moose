/// <reference path="../../typings/tsd.d.ts" />

import moment = require('moment');

import IDocument = require('../database/IDocument');

class Reward implements IDocument {
	private _expiration: moment.Moment;
	
	/** Percent 0..1 */
	private _payout: number;
	
	constructor(expiration: moment.Moment, payout: number) {
		this._expiration = expiration;
		this._payout = payout;
	}
	
	get expiration() {
		return this._expiration;
	}
	
	get payout() {
		return this._payout;
	}
	
	toDocument() {
		return {
			expiration: this.expiration.toDate(),
			payout: this.payout
		}
	}
}

export = Reward;