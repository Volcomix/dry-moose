/// <reference path="../../typings/tsd.d.ts" />

import IInvestor = require('./IInvestor');
import IOption = require('../options/IOption');

class DemoInvestor implements IInvestor {
	invest(option: IOption) {
		console.log(option);
	}
}