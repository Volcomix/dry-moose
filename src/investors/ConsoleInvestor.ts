/// <reference path="../../typings/tsd.d.ts" />

import IInvestor = require('./IInvestor');
import AbstractOption = require('../options/AbstractOption');

class ConsoleInvestor implements IInvestor {
	invest(option: AbstractOption): void {
		console.log(option.toString());
	}
}

export = ConsoleInvestor;