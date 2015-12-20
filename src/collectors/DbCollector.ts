/// <reference path="../../typings/tsd.d.ts" />

import Q = require('q');

import DbManager = require('../database/DbManager');
import ICollector = require('./ICollector');
import Quote = require('../documents/Quote');

class DbCollector implements ICollector {
	
	constructor(private collectionName: string, private limit?: number) { }
	
	collect(): Q.Promise<void> {
		return Q.Promise<void>((resolve, reject, notify) => {
			var cursor = DbManager.db.collection(this.collectionName).find();
			
			if (this.limit) {
				cursor.limit(this.limit);
			}
			
			cursor.each((err, quote: Quote) => {
				if (err) return reject(err);
				if (quote == null) return resolve(null);
				notify(quote);
			});
		});
	}
}

export = DbCollector;