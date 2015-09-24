/// <reference path="../../typings/tsd.d.ts" />

import mongodb = require('mongodb');
import Q = require('q');

import DbManager = require('../database/DbManager');
import ICelebrator = require('./ICelebrator');
import BinaryOption = require('../options/BinaryOption');

class DemoCelebrator implements ICelebrator<BinaryOption> {
	getGain(option: BinaryOption): Q.Promise<number> {
		return DbManager.db
		.then((db: mongodb.Db) => {
			var cursor = db.collection('quotes')
			.find({
				'quote.dateTime': {
					$gt: option.quote.dateTime,
					$lte: option.expiration.toDate()
				},
				'quote.close': (
					option.direction == BinaryOption.Direction.Call ?
					{ $gte: option.quote.close } :
					{ $lte: option.quote.close }
				)
			})
			.sort({ 'quote.dateTime': -1 })
			.limit(1);
			
			return Q.ninvoke<number>(cursor, 'count', true);
		})
		.then((count: number) => {
			return count * option.amount * (1 + option.payout);
		});
	}
}

export = DemoCelebrator;