/// <reference path="../../typings/tsd.d.ts" />

import moment = require('moment');

interface Reward {
	expiration: moment.Moment;
	
	/** 0..1 */
	percent: number;
}

export = Reward;