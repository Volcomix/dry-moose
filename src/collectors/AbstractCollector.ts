/// <reference path="../../typings/tsd.d.ts" />

import mongodb = require('mongodb');
import Q = require('q');

import DbManager = require('../database/DbManager');
import IProcessor = require('../processors/IProcessor');
import IInvestor = require('../investors/IInvestor');
import AbstractQuote = require('../quotes/AbstractQuote');
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
		private processor: IProcessor<AbstractQuote, AbstractOption>,
		private investor: IInvestor
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
	
	process(quote: AbstractQuote, rewards: Reward[]) {
		this.pendingDb = Q.when(this.pendingDb, () => {
			return Q.ninvoke(this.db.collection('quotes'), 'insertOne', {
				quote: quote.toDocument(),
				rewards: rewards.map((reward: Reward) => { return reward.toDocument(); })
			});
		})
		.then(() => {
			if (this.pendingOption && quote.dateTime >= this.pendingOption.expiration) {
				//var reward = 
			}
		})
		.then(() => {	
			var option = this.processor.process(quote, rewards);
			if (option) {
				return Q.ninvoke(this.db.collection('options'), 'insertOne',
					option.toDocument()
				)
				.then(() => {
					this.investor.invest(option);
				});
			}
		});
	}
}

export = AbstractCollector;