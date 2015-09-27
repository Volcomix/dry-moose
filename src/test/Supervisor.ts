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

var should = chai.should();

describe('Supervisor', function() {
	
	before(function() {
		return DbManager.connect('test-Supervisor');
	});
	
	describe('#run()', function() {
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
				var cursor = DbManager.db.collection('quotes').find();
				return Q.ninvoke(cursor, 'count');
			})
			.then(function(count: number) {
				count.should.equal(1439);
			})
			.then(function() {
				var cursor = DbManager.db.collection('quotes')
				.find({dateTime: new Date('2015-06-01 12:00:00-0500')});
				return Q.ninvoke(cursor, 'next');
			})
			.then(function(quote: Quote) {
				delete quote['_id']; // Generated by MongoDB
				quote.should.deep.equal(<Quote> {
					dateTime: new Date('2015-06-01 12:00:00-0500'),
					open: 1.091230, high: 1.091310, low: 1.090950, close: 1.090960,
					volume: 0,
					rewards: [{
						countdown: new Date('2015-06-01 12:20:00-0500'),
						expiration: new Date('2015-06-01 12:30:00-0500'),
						payout: 0.75,
					}]
				});
			});
		})
	});
	
	after(function() {
		return Q.ninvoke(DbManager.db, 'dropDatabase')
		.then(function() {
			return DbManager.close();
		});
	});
});