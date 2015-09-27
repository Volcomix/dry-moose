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
	});
	
	after(function() {
		// Supervisor close db so reconnect to drop database
		return DbManager.connect('test-Supervisor')
		.then(function() {
			return Q.ninvoke(DbManager.db, 'dropDatabase');
		})
		.then(function() {
			return DbManager.close();
		});
	});
});