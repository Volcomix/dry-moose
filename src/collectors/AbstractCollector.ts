/// <reference path="../../typings/tsd.d.ts" />

import mongodb = require('mongodb');
import Q = require('q');
import moment = require('moment');

import DbManager = require('../database/DbManager');
import IProcessor = require('../processors/IProcessor');
import IInvestor = require('../investors/IInvestor');
import ICelebrator = require('../celebrators/ICelebrator');
import ICapacitor = require('../capacitors/ICapacitor');
import Quote = require('../documents/Quote');
import Reward = require('../documents/Reward');
import Option = require('../documents/options/Option');

var MongoClient = mongodb.MongoClient;

/**
 * Collect trading quotes
 */
abstract class AbstractCollector {
	
	private db: mongodb.Db;
	private pendingDb: Q.Promise<any>;
	private pendingOption: Option;
	private innerPortfolio: number;
	
	constructor(
		private processor: IProcessor,
		private investor: IInvestor,
		private celebrator: ICelebrator,
		private capacitor: ICapacitor
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
				}),
				Q.ninvoke(this.db.collection('portfolio'), 'createIndex', {
					'dateTime': 1
				})
			];
		})
		.spread(() => {
			return this.capacitor.getPortfolio();
		})
		.then((portfolio) => {
			this.innerPortfolio = portfolio;
			
			// Main loop
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
					this.innerPortfolio += gain;
					return Q.all([
						Q.ninvoke(this.db.collection('portfolio'), 'insertOne', {
							dateTime: option.expiration,
							portfolio: this.innerPortfolio
						}),
						Q.ninvoke(this.db.collection('rewards'), 'insertOne',  {
							dateTime: option.expiration,
							gain: gain
						})
					]);
				});
			}
		})
		.then(() => {
			return this.capacitor.getPortfolio();
		})
		.then((portfolio) => {
			if (this.innerPortfolio != portfolio) {
				throw new Error('Estimated portfolio and real portfolio are different');
			}
			
			if (this.pendingOption) {
				return;
			}
			
			var option = this.processor.process(portfolio, quote, rewards);
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