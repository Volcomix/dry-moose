/// <reference path="../../../typings/tsd.d.ts" />

import Option = require('./Option');
import Quote = require('../Quote');

interface BinaryOption extends Option {
	payout: number;
	direction: BinaryOption.Direction;
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
	
	export function toString(option: BinaryOption): string {
		return BinaryOption.Direction.toString(option.direction) +
			' for ' + option.amount + '(' + option.payout + ')' +
			'$ expiring at ' + option.expiration
	}
}

export = BinaryOption;