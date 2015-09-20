/// <reference path="../../typings/tsd.d.ts" />

import IInvestor = require('./IInvestor');
import IOption = require('../options/IOption');
import BinaryOption = require('../options/BinaryOption');

class ConsoleInvestor implements IInvestor {
	invest(option: IOption) {
		if (option instanceof BinaryOption) {
			console.log(
				BinaryOption.Direction.toString(option.direction) +
				' for ' + option.amount + '$ expiring at ' + option.expiration.format()
			);
		} else {
			console.error('Unknown option type');
		}
	}
}

export = ConsoleInvestor;