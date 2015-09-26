/// <reference path="../../typings/tsd.d.ts" />

import mongodb = require('mongodb');
import Q = require('q');

import ICapacitor = require('./ICapacitor');
import DbManager = require('../database/DbManager');
import Portfolio = require('../documents/Portfolio');

class DemoCapacitor implements ICapacitor {
	
	constructor(private initialValue: number) { }
	
	getPortfolio(): Q.Promise<number> {
		return DbManager.db
		.then((db: mongodb.Db) => {
			var cursor = db.collection('portfolio').find().sort({ 'dateTime': -1 });
			
			return Q.ninvoke(cursor, 'limit', 1);
		})
		.then((portfolio: Portfolio) => {
			return portfolio ? portfolio.value : this.initialValue;
		});
	}
}

export = DemoCapacitor;