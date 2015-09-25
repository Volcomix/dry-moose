/// <reference path="../../typings/tsd.d.ts" />

import IInvestor = require('./IInvestor');
import Option = require('../documents/Option');

class ConsoleInvestor implements IInvestor {
	invest(option: Option): void {
		console.log(option.toString());
	}
}

export = ConsoleInvestor;