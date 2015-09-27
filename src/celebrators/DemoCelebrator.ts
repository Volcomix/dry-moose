/// <reference path="../../typings/tsd.d.ts" />

import Q = require('q');

import DbManager = require('../database/DbManager');
import ICelebrator = require('./ICelebrator');
import Quote = require('../documents/Quote');
import BinaryOption = require('../documents/options/BinaryOption');

class DemoCelebrator implements ICelebrator {
	getGain(option: BinaryOption): Q.Promise<number> {
		return Q.ninvoke(DbManager.db.collection('quotes'), 'aggregate', [
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
		])
		.then((quotes: Quote[]) => {
			return quotes.length * option.amount * (1 + option.payout);
		});
	}
}

export = DemoCelebrator;