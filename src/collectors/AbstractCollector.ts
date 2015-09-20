/// <reference path="../../typings/tsd.d.ts" />

import mongodb = require('mongodb');
import Q = require('q');

import IProcessor = require('../processors/IProcessor');
import IInvestor = require('../investors/IInvestor');
import IQuote = require('../quotes/IQuote');
import Reward = require('../options/Reward');
import IOption = require('../options/IOption');

var MongoClient = mongodb.MongoClient;

abstract class AbstractCollector {
	
	private db: mongodb.Db;
	private pending: Q.Promise<IOption>;
	
	constructor(
		private processor: IProcessor<IQuote, IOption>,
		private investor: IInvestor
	) { }
	
	abstract collect(): Q.Promise<{}>;
	
	run(): Q.Promise<{}> {
		return Q.nfcall(MongoClient.connect, 'mongodb://localhost:27017/test')
		.then((db: mongodb.Db) => {
			this.db = db;
			return this.collect();
		})
		.finally(() => {
			return Q.when(this.pending, () => {
				return Q.ninvoke(this.db, 'close');
			});
		})
	}
	
	process(quote: IQuote, rewards: Reward[]) {
		this.pending = Q.ninvoke(this.db.collection('process'), 'insertOne', {
			quote: quote.toDocument(),
			rewards: rewards.map((reward: Reward) => { return reward.toDocument(); })
		})
		.then(() => {	
			var option = this.processor.process(quote, rewards);
			if (option) {
				this.investor.invest(option);
			}
			return option;
		});
	}
}

export = AbstractCollector;