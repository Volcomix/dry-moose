/// <reference path="../../typings/tsd.d.ts" />

import Q = require('q');

import DbManager = require('../database/DbManager');
import ICapacitor = require('./ICapacitor');
import Portfolio = require('../documents/Portfolio');

class DemoCapacitor implements ICapacitor {
	
	constructor(private initialValue: number) { }
	
	getPortfolio(): Q.Promise<number> {
		var cursor = DbManager.db.collection('portfolio')
		.find()
		.sort({ dateTime: -1 })
		.limit(1);
			
		return Q.ninvoke(cursor, 'next')
		.then((portfolio: Portfolio) => {
			return portfolio ? portfolio.value : this.initialValue;
		});
	}
}

export = DemoCapacitor;