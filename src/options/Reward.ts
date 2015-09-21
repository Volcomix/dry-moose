/// <reference path="../../typings/tsd.d.ts" />

import moment = require('moment');

import IDocument = require('../database/IDocument');

class Reward implements IDocument {
	private _countdown: moment.Moment;
	private _expiration: moment.Moment;
	
	/** Percent 0..1 */
	private _payout: number;
	
	constructor(countdown: moment.Moment, expiration: moment.Moment, payout: number) {
		this._countdown = countdown;
		this._expiration = expiration;
		this._payout = payout;
	}
	
	get countdown() {
		return this._countdown;
	}
	
	get expiration() {
		return this._expiration;
	}
	
	get payout() {
		return this._payout;
	}
	
	toDocument() {
		return {
			countdown: this.countdown.toDate(),
			expiration: this.expiration.toDate(),
			payout: this.payout
		}
	}
}

export = Reward;