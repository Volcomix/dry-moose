/// <reference path="../../typings/tsd.d.ts" />

import MovingAverage = require('./MovingAverage');

interface MACross {
	fast: MovingAverage[];
	slow: MovingAverage[];
	cross: MovingAverage[];
}

export = MACross;