/// <reference path="../../typings/tsd.d.ts" />

import IInvestor = require('./IInvestor');
import IOption = require('../options/IOption');
import BinaryOption = require('../options/BinaryOption');

class DemoInvestor implements IInvestor {
	invest(option: IOption) {
		if (option instanceof BinaryOption) {
			console.log({
				expiration: option.expiration.format(),
				amount: option.amount,
				direction: option.direction == BinaryOption.Direction.Call ? 'Call' : 'Put'
			});
		} else {
			console.error('Unknown option type');
		}
	}
}

export = DemoInvestor;