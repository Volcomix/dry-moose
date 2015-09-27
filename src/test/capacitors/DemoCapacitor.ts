/// <reference path="../../../typings/tsd.d.ts" />

import chai = require('chai');

import DbManager = require('../../database/DbManager');
import DemoCapacitor = require('../../capacitors/DemoCapacitor');

var should = chai.should();

describe('DemoCapacitor', function() {
	var capacitor = new DemoCapacitor(100);
	describe('#getPortfolio()', function() {
		it('should return 100', function() {
			return capacitor.getPortfolio()
			.then((portfolio) => {
				portfolio.should.equal(100);
			})
		});
	});
	
	after(function() {
		return DbManager.db
		.then((db) => {
			return db.close();
		});
	});
});