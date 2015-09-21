/// <reference path="../../typings/tsd.d.ts" />

import mongodb = require('mongodb');
import Q = require('q');

import IProcessor = require('../processors/IProcessor');
import IInvestor = require('../investors/IInvestor');
import IQuote = require('../quotes/IQuote');
import Reward = require('../options/Reward');
import IOption = require('../options/IOption');

var MongoClient = mongodb.MongoClient;

/**
 * Collect trading quotes
 */
abstract class AbstractCollector {
	
	private db: mongodb.Db;
	private pending: Q.Promise<{}>;
	
	constructor(
		private processor: IProcessor<IQuote, IOption>,
		private investor: IInvestor
	) { }
	
	abstract collect(): Q.Promise<{}>;
	
	run(): Q.Promise<{}> {
		return Q.nfcall(MongoClient.connect, 'mongodb://localhost:27017/dry-moose')
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
			return Q.when(this.pending, () => {
				return Q.ninvoke(this.db, 'close');
			});
		})
	}
	
	process(quote: IQuote, rewards: Reward[]) {
		this.pending = Q.when(this.pending, () => {
			Q.ninvoke(this.db.collection('quotes'), 'insertOne', {
				quote: quote.toDocument(),
				rewards: rewards.map((reward: Reward) => { return reward.toDocument(); })
			});
		})
		.then<{}>(() => {	
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