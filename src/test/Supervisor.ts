/// <reference path="../../typings/tsd.d.ts" />

import chai = require('chai');
import Q = require('q');
import moment = require('moment');

import DbManager = require('../database/DbManager');
import Supervisor = require('../Supervisor');
import GenericASCIIM1 = require('../collectors/GenericASCIIM1');
import DummyProcessor = require('../processors/DummyProcessor');
import SilentInvestor = require('../investors/SilentInvestor');
import DemoCelebrator = require('../celebrators/DemoCelebrator');
import DemoCapacitor = require('../capacitors/DemoCapacitor');
import Reward = require('../documents/Reward');
import Quote = require('../documents/Quote');
import BinaryOption = require('../documents/options/BinaryOption');
import Gain = require('../documents/Gain');
import Portfolio = require('../documents/Portfolio');

var should = chai.should();

describe('Supervisor', function() {
	
	before(function() {
		return DbManager.connect('test-Supervisor');
	});
	
	describe('#run()', function() {
		
		var quote: Quote = {
			dateTime: new Date('2015-06-01 12:00:00-0500'),
			open: 1.091230, high: 1.091310, low: 1.090950, close: 1.090960,
			volume: 0,
			rewards: [{
				countdown: new Date('2015-06-01 12:20:00-0500'),
				expiration: new Date('2015-06-01 12:30:00-0500'),
				payout: 0.75,
			}]
		}
		
		it('should run', function() {
			return new Supervisor(
				new GenericASCIIM1('src/test/Supervisor.csv', [ <Reward> {
					countdown: moment({ minutes: 10 }).toDate(),
					expiration: moment({ minutes: 30 }).toDate(),
					payout: 0.75
				}]),
				new DummyProcessor(),
				new SilentInvestor(),
				new DemoCelebrator(),
				new DemoCapacitor(100)
			)
			.run();
		});
		it('should collect quotes', function() {
			// Supervisor close db so reconnect to continue tests
			return DbManager.connect('test-Supervisor')
			.then(function() {
				return Q.ninvoke(DbManager.db.collection('quotes'), 'count');
			})
			.then(function(count: number) {
				count.should.equal(1439);
				
				return Q.ninvoke(DbManager.db.collection('quotes'), 'aggregate', [
					{ $match: { dateTime: new Date('2015-06-01 12:00:00-0500') } },
					{ $project: {
						_id: 0, dateTime: 1,
						open: 1, high: 1, low: 1, close: 1, volume: 1,
						rewards: 1
					}}
				]);
			})
			.spread(function(quote: Quote) {
				quote.should.deep.equal(quote);
			});
		});
		it('should buy options', function() {
			return Q.ninvoke(DbManager.db.collection('options'), 'aggregate', [
				{ $group: { "_id": "$direction", "count": { $sum: 1 }}}
			])
			.then(function(result) {
				result.should.deep.equal([
					{ _id: BinaryOption.Direction.Call, count: 24 },
					{ _id: BinaryOption.Direction.Put, count: 22 }
				]);
				
				return Q.ninvoke(DbManager.db.collection('options'), 'aggregate', [
					{ $match: {
						'quote.dateTime':  new Date('2015-06-01 12:00:00-0500')
					}},
					{ $project: {
						_id: 0, quote: 1,
						expiration: 1, amount: 1, payout: 1, direction: 1
					}}
				]);
			})
			.spread(function(option: BinaryOption) {
				
				// _id field could be removed on top-level document only
				delete option.quote['_id'];
				
				option.should.deep.equal(<BinaryOption> {
					quote: quote,
					expiration: new Date('2015-06-01 12:30:00-0500'),
					amount: 10,
					payout: 0.75,
					direction: BinaryOption.Direction.Put
				});
			});
		});
		it('should get gains', function() {
			return Q.ninvoke(DbManager.db.collection('gains'), 'aggregate', [
				{ $group: { "_id": "$value", "count": { $sum: 1 }}}
			])
			.then(function(result) {
				result.should.deep.equal([
					{ _id: 17.5, count: 24 },
					{ _id: 0, count: 22 }
				]);
				
				return Q.ninvoke(DbManager.db.collection('gains'), 'aggregate', [
					{ $match: { dateTime: { $in: [
						new Date('2015-06-01 12:00:00-0500'),
						new Date('2015-06-01 12:30:00-0500')
					]}}},
					{ $project: { _id: 0, dateTime: 1, value: 1 }}
				]);
			})
			.then(function(gains: Gain[]) {
				gains.should.have.length(2);
				gains.should.deep.equal(<Gain[]> [
					{ dateTime: new Date('2015-06-01 12:00:00-0500'), value: 17.5 },
					{ dateTime: new Date('2015-06-01 12:30:00-0500'), value: 0 }
				]);
			});
		});
		it('should update portfolio', function() {
			return Q.ninvoke(DbManager.db.collection('portfolio'), 'count')
			.then(function(count) {
				count.should.equal(92);
				
				return Q.ninvoke(DbManager.db.collection('portfolio'), 'aggregate', [
					{ $sort: {dateTime: -1 }},
					{ $limit: 1 },
					{ $project: { _id: 0, dateTime: 1, value: 1 }}
				]);
			})
			.spread(function(portfolio: Portfolio) {
				portfolio.should.deep.equal(<Portfolio> {
					dateTime: new Date('2015-06-02 00:00:00-0500'),
					value: 60
				});
			});
		});
	});
	
	after(function() {
		return Q.ninvoke(DbManager.db, 'dropDatabase')
		.then(function() {
			return DbManager.close();
		});
	});
});