/// <reference path="../../typings/tsd.d.ts" />

import mongodb = require('mongodb');
import Q = require('q');

import ICapacitor = require('./ICapacitor');
import DbManager = require('../database/DbManager');
import Portfolio = require('../documents/Portfolio');

class DemoCapacitor implements ICapacitor {
	
	constructor(private initialValue: number, private db?: mongodb.Db) { }
	
	getPortfolio(): Q.Promise<number> {
		return Q.when(
			this.db ||
			DbManager.connect().then((db) => { return this.db = db; })
		)
		.then((db) => {
			var cursor = db.collection('portfolio')
			.find()
			.sort({ dateTime: -1 })
			.limit(1);
			
			return Q.ninvoke(cursor, 'next');
		})
		.then((portfolio: Portfolio) => {
			return portfolio ? portfolio.value : this.initialValue;
		});
	}
}

export = DemoCapacitor;