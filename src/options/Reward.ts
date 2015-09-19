/// <reference path="../../typings/tsd.d.ts" />

import moment = require('moment');

interface Reward {
	expiration: moment.Moment;
	
	/** Percent 0..1 */
	payout: number;
}

export = Reward;