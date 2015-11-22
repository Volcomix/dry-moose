/// <reference path="../../typings/tsd.d.ts" />

import BinaryOption = require('./options/BinaryOption');
import Quote = require('./Quote');

interface Gain {
	option: BinaryOption,
	quote: Quote,
	dateTime: Date,
	value: number
}

export = Gain;