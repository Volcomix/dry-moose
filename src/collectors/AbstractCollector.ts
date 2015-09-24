/// <reference path="../../typings/tsd.d.ts" />

import mongodb = require('mongodb');
import Q = require('q');
import moment = require('moment');

import DbManager = require('../database/DbManager');
import IProcessor = require('../processors/IProcessor');
import IInvestor = require('../investors/IInvestor');
import ICelebrator = require('../celebrators/ICelebrator');
import Quote = require('../quotes/Quote');
import Reward = require('../options/Reward');
import AbstractOption = require('../options/AbstractOption');

var MongoClient = mongodb.MongoClient;

/**
 * Collect trading quotes
 */
abstract class AbstractCollector {
	
	private db: mongodb.Db;
	private pendingDb: Q.Promise<any>;
	private pendingOption: AbstractOption;
	
	constructor(
		private processor: IProcessor,
		private investor: IInvestor,
		private celebrator: ICelebrator
	) { }
	
	abstract collect(): Q.Promise<{}>;
	
	run(): Q.Promise<{}> {
		return DbManager.db
		.then((db: mongodb.Db) => {
			this.db = db;
			return [
				Q.ninvoke(this.db.collection('quotes'), 'createIndex', {
					'quote.dateTime': 1
				}),
				Q.ninvoke(this.db.collection('options'), 'createIndex', {
					'expiration': 1
				}),
				Q.ninvoke(this.db.collection('rewards'), 'createIndex', {
					'dateTime': 1
				})
			];
		})
		.spread(() => {
			return this.collect();
		})
		.finally(() => {
			return Q.when(this.pendingDb, () => {
				return Q.ninvoke(this.db, 'close');
			});
		})
	}
	
	process(quote: Quote, rewards: Reward[]) {
		this.pendingDb = Q.when(this.pendingDb, () => {
			return Q.ninvoke(this.db.collection('quotes'), 'insertOne', {
				quote: quote,
				rewards: rewards
			});
		})
		.then(() => {
			if (
				this.pendingOption &&
				// dateTime >= exp
				!moment(quote.dateTime).isBefore(this.pendingOption.expiration)
			) {
				var option = this.pendingOption;
				this.pendingOption = undefined;
				return this.celebrator.getGain(option)
				.then((gain) => {
					return Q.ninvoke(this.db.collection('rewards'), 'insertOne',  {
						dateTime: option.expiration,
						gain: gain
					});
				});
			}
		})
		.then(() => {
			if (this.pendingOption) {
				return;
			}
			
			var option = this.processor.process(quote, rewards);
			if (option) {
				return Q.ninvoke(this.db.collection('options'), 'insertOne', option)
				.then(() => {
					this.pendingOption = option;
					this.investor.invest(option);
				});
			}
		});
	}
}

export = AbstractCollector;