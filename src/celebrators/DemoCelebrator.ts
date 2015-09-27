/// <reference path="../../typings/tsd.d.ts" />

import mongodb = require('mongodb');
import Q = require('q');

import DbManager = require('../database/DbManager');
import ICelebrator = require('./ICelebrator');
import Quote = require('../documents/Quote');
import BinaryOption = require('../documents/options/BinaryOption');

class DemoCelebrator implements ICelebrator {
	
	constructor(private db?: mongodb.Db) { }
	
	getGain(option: BinaryOption): Q.Promise<number> {
		return Q.when(
			this.db ||
			DbManager.connect().then((db) => { return this.db = db; })
		)
		.then((db) => {
			return Q.ninvoke(db.collection('quotes'), 'aggregate', [
				{ $match: { dateTime: {
					$gt: option.quote.dateTime,
					$lte: option.expiration
				}}},
				{ $sort: { dateTime: -1 } },
				{ $limit: 1 },
				{ $match: { close: (
					option.direction == BinaryOption.Direction.Call ?
					{ $gte: option.quote.close } :
					{ $lte: option.quote.close }
				)}}
			]);
		})
		.then((quotes: Quote[]) => {
			return quotes.length * option.amount * (1 + option.payout);
		});
	}
}

export = DemoCelebrator;