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
	
	private pendingOption: Option;
	private innerPortfolio: number;
	
	constructor(
		private collector: ICollector,
		private processor: IProcessor,
		private investor: IInvestor,
		private celebrator: ICelebrator,
		private capacitor: ICapacitor
	) { }
	
	run(): Q.Promise<void> {
		var inProgress = Q<void>(null);
		
		return this.init()
		.then(() => {
			return this.collector.collect();
		})
		.progress((quote: Quote) => {
			inProgress = inProgress.then(() => {
				return this.handleQuote(quote);
			});
		})
		.finally(() => {
			return inProgress.finally(() => {
				return this.done();
			});
		})
	}
	
	private init(): Q.Promise<void> {
		return DbManager.connect()
		.then(() => {
			return this.capacitor.getPortfolio();
		})
		.then(portfolio => {
			this.innerPortfolio = portfolio;
		});
	}
	
	private handleQuote(quote: Quote): Q.Promise<void> {
		return Q.ninvoke(DbManager.db.collection('quotes'), 'insertOne', quote)
		.then(() => {
			if (
				this.pendingOption &&
				// dateTime >= exp
				!moment(quote.dateTime).isBefore(this.pendingOption.expiration)
			) {
				return this.getGain();
			}
		})
		.then(() => {
			return this.getPortfolio();
		})
		.then(portfolio => {
			if (portfolio <= 0) {
				throw new Error('Portfolio is empty... Game Over!');
			}
			var option = this.process(portfolio, quote);
			if (option) {
				return this.invest(quote, option);
			}
		});
	}
	
	private done(): Q.Promise<void> {
		return Q(this.pendingOption)
		.then((pendingOption: Option) => {
			if (pendingOption) {
				return this.getGain();
			}
		})
		.then(() => {
			return DbManager.close();
		});
	}
	
	private getGain(): Q.Promise<void[]> {
		var option = this.pendingOption;
		this.pendingOption = undefined;
		
		return this.celebrator.getGain(option)
		.then(gain => {
			this.innerPortfolio += gain.value;
			
			return Q.all([
				Q.ninvoke<void>(DbManager.db.collection('portfolio'), 'insertOne',
					<Portfolio> {
						dateTime: option.expiration,
						value: this.innerPortfolio
					}
				),
				Q.ninvoke<void>(DbManager.db.collection('gains'), 'insertOne', gain)
			]);
		});
	}
	
	private getPortfolio(): Q.Promise<number> {
		return this.capacitor.getPortfolio()
		.then(portfolio => {
			if (this.innerPortfolio != portfolio) {
				throw new Error(
					'Estimated portfolio and real portfolio are different ' +
					JSON.stringify({
						estimated: this.innerPortfolio,
						real: portfolio
					})
				);
			}
			
			return portfolio;
		});
	}
	
	private process(portfolio: number, quote: Quote): Option {
		return this.processor.process(portfolio, quote, !!this.pendingOption);
	}
	
	private invest(quote: Quote, option: Option): Q.Promise<void> {
		this.innerPortfolio -= option.amount;
		
		return Q.all([
			Q.ninvoke(DbManager.db.collection('options'), 'insertOne', option),
			Q.ninvoke(DbManager.db.collection('portfolio'), 'insertOne',
				<Portfolio> {
					dateTime: quote.dateTime,
					value: this.innerPortfolio
				}
			)
		])
		.then(() => {
			this.pendingOption = option;
			this.investor.invest(option);
		});
	}
}

export = Supervisor;