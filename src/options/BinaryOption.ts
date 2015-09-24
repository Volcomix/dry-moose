/// <reference path="../../typings/tsd.d.ts" />

import moment = require('moment');

import AbstractOption = require('./AbstractOption');
import Quote = require('../quotes/Quote');

class BinaryOption extends AbstractOption {	
	
	private _quote: Quote;
	private _amount: number;
	private _payout: number;
	private _direction: BinaryOption.Direction;
	
	constructor(
		quote: Quote,
		expiration: moment.Moment,
		amount: number,
		payout: number,
		direction: BinaryOption.Direction
	) {
		super(expiration);
		this._quote = quote;
		this._amount = amount;
		this._payout = payout;
		this._direction = direction;
	}
	
	get quote() {
		return this._quote;
	}
	
	get amount() {
		return this._amount;
	}
	
	get payout() {
		return this._payout;
	}
	
	get direction() {
		return this._direction;
	}
	
	toDocument() {
		return {
			quote: this.quote.toDocument(),
			expiration: this.expiration.toDate(),
			amount: this._amount,
			payout: this._payout,
			direction: this._direction
		}
	}
	
	toString() {
		return BinaryOption.Direction.toString(this._direction) +
			' for ' + this._amount + '(' + this._payout + ')' +
			'$ expiring at ' + this.expiration.format()
	}
}
module BinaryOption {
	export enum Direction { Call, Put };
	export module Direction {
		export function toString(direction: Direction): string {
			switch (direction) {
				case Direction.Call:
					return 'Call';
				case Direction.Put:
					return 'Put';
			}
		}
	}
}

export = BinaryOption;