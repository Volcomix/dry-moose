/// <reference path="../../typings/tsd.d.ts" />

import Q = require('q');

import DbManager = require('../database/DbManager');
import ICelebrator = require('./ICelebrator');
import Gain = require('../documents/Gain');
import Quote = require('../documents/Quote');
import BinaryOption = require('../documents/options/BinaryOption');

class DemoCelebrator implements ICelebrator {
	getGain(option: BinaryOption): Q.Promise<Gain> {
		return Q.ninvoke(DbManager.db.collection('quotes'), 'aggregate', [
			{ $match: { dateTime: {
				$gt: option.quote.dateTime,
				$lte: option.expiration
			}}},
			{ $sort: { dateTime: -1 } },
			{ $limit: 1 }
		])
		.spread((quote: Quote) => ({
			option,
			quote,
			dateTime: option.expiration,
			value: this.getGainFromQuote(option, quote)
		}));
	}
	
	private getGainFromQuote(option: BinaryOption, quote: Quote) {
		if (!quote) return 0;
		
		switch (option.direction) {
			
			case BinaryOption.Direction.Call:
				if (quote.close >= option.quote.close) {
					return this.getOptionGain(option);
				}
				break;
			
			case BinaryOption.Direction.Put:
				if (quote.close <= option.quote.close) {
					return this.getOptionGain(option);
				}
				break;
		}
		return 0;
	}
	
	private getOptionGain(option: BinaryOption) {
		return option.amount * (1 + option.payout);
	}
}

export = DemoCelebrator;