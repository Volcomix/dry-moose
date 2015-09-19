/// <reference path="../../typings/tsd.d.ts" />

import moment = require('moment');

import IOption = require('./IOption');

class BinaryOption implements IOption {	
	
	private _expiration: moment.Moment;
	private _amount: number;
	private _direction: BinaryOption.Direction;
	
	constructor(
		expiration: moment.Moment,
		amount: number,
		direction: BinaryOption.Direction
	) {
		this._expiration = expiration;
		this._amount = amount;
		this._direction = direction;
	}
	
	get expiration() {
		return this._expiration;
	}
	
	get amount() {
		return this._amount;
	}
	
	get direction() {
		return this._direction;
	}
}
module BinaryOption {
	export enum Direction { Call, Put };
}

export = BinaryOption;