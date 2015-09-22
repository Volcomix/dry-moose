/// <reference path="../../typings/tsd.d.ts" />

import ICelebrator = require('./ICelebrator');
import BinaryOption = require('../options/BinaryOption');

class DemoCelebrator implements ICelebrator<BinaryOption> {
	getReward(option: BinaryOption) {
		
	}
}

export = DemoCelebrator;