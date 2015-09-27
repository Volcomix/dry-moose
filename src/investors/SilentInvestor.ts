/// <reference path="../../typings/tsd.d.ts" />

import IInvestor = require('./IInvestor');
import Option = require('../documents/options/Option');

class SilentInvestor implements IInvestor {
	invest(option: Option): void { }
}

export = SilentInvestor;