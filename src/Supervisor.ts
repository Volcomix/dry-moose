/// <reference path="../typings/tsd.d.ts" />

import mongodb = require('mongodb');
import Q = require('q');
import moment = require('moment');

import DbManager = require('./database/DbManager');
import ICollector = require('./collectors/ICollector');
import IProcessor = require('./processors/IProcessor');
import IInvestor = require('./investors/IInvestor');
import ICelebrator = require('./celebrators/ICelebrator');
import ICapacitor = require('./capacitors/ICapacitor');
import Quote = require('./documents/Quote');
import Option = require('./documents/options/Option');
import Portfolio = require('./documents/Portfolio');
import Gain = require('./documents/Gain');

/**
 * Main class which supervises everything 
 */
class Supervisor {
	
	private pendingDb: Q.Promise<void>;
	private pendingOption: Option;
	private innerPortfolio: number;
	
	constructor(
		private collector: ICollector,
		private processor: IProcessor,
		private investor: IInvestor,
		private celebrator: ICelebrator,
		private capacitor: ICapacitor,
		private db?: mongodb.Db
	) { }
	
	run(): Q.Promise<void> {
		return this.init()
		.then<void>(this.collector.collect.bind(this.collector))
		.progress(this.handleQuote.bind(this))
		.finally(this.done.bind(this))
	}
	
	private init(): Q.Promise<void> {
		return Q.when(
			this.db ||
			DbManager.connect().then((db) => { return this.db = db; }))
		.then((db) => {
			return this.capacitor.getPortfolio();
		})
		.then((portfolio) => {
			this.innerPortfolio = portfolio;
		});
	}
	
	private handleQuote(quote: Quote) {
		this.pendingDb = Q.when(this.pendingDb)
		.then(() => {
			return Q.ninvoke(this.db.collection('quotes'), 'insertOne', quote);
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
						Q.ninvoke(this.db.collection('portfolio'), 'insertOne', <Portfolio>{
							dateTime: option.expiration,
							value: this.innerPortfolio
						}),
						Q.ninvoke(this.db.collection('gains'), 'insertOne', <Gain>{
							dateTime: option.expiration,
							value: gain
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
				throw new Error(
					'Estimated portfolio and real portfolio are different ' +
					JSON.stringify({
						estimated: this.innerPortfolio,
						real: portfolio
					})
				);
			}
			
			if (this.pendingOption) {
				return;
			}
			
			var option = this.processor.process(portfolio, quote);
			if (option) {
				this.innerPortfolio -= option.amount;
				return Q.all([
					Q.ninvoke(this.db.collection('options'), 'insertOne', option),
					Q.ninvoke(this.db.collection('portfolio'), 'insertOne', {
						dateTime: quote.dateTime,
						value: this.innerPortfolio
					})
				])
				.then(() => {
					this.pendingOption = option;
					this.investor.invest(option);
				});
			}
		});
	}
	
	private done(): Q.Promise<void> {
		return Q.when(this.pendingDb)
		.then(() => {
			return Q.ninvoke<void>(this.db, 'close');
		});
	}
}

export = Supervisor;