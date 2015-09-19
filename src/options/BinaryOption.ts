/// <reference path="../../typings/tsd.d.ts" />

import moment = require('moment');

import IOption = require('./IOption');

class BinaryOption implements IOption {	
	constructor(private option: BinaryOption._option) { }
}
module BinaryOption {
	export enum _option { Call, Put, None };
	
	export var Call: BinaryOption = new BinaryOption(_option.Call);
	export var Put: BinaryOption = new BinaryOption(_option.Put);
	export var None: BinaryOption = new BinaryOption(_option.None);
}

export = BinaryOption;