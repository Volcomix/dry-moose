/// <reference path="../../typings/tsd.d.ts" />

import IInvestor = require('./IInvestor');
import IOption = require('../options/IOption');
import BinaryOption = require('../options/BinaryOption');

class ConsoleInvestor implements IInvestor {
	invest(option: IOption): void {
		console.log(option.toString());
	}
}

export = ConsoleInvestor;