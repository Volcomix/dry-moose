import IInvestor = require('./IInvestor');
import Option = require('../documents/options/Option');

class ConsoleInvestor implements IInvestor {
	invest(option: Option): void {
		console.log(option);
	}
}

export = ConsoleInvestor;