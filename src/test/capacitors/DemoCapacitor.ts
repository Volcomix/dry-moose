import chai = require('chai');
import Q = require('q');

import DbManager = require('../../database/DbManager');
import DemoCapacitor = require('../../capacitors/DemoCapacitor');
import Portfolio = require('../../documents/Portfolio');

var should = chai.should();

describe('DemoCapacitor', function() {
	
	var capacitor = new DemoCapacitor(100);
	
	before(function() {
		return DbManager.connect('test-DemoCapacitor');
	});
	
	describe('#getPortfolio()', function() {
		context('when database empty', function() {
			it('should return initial value', function() {
				return capacitor.getPortfolio()
				.then(function(portfolio) {
					portfolio.should.equal(100);
				});
			});
		});
		context('when database contains portfolio', function() {
			it('should return 1st value', function() {
				return Q.ninvoke(DbManager.db.collection('portfolio'), 'insertOne',
					<Portfolio> {
						dateTime: new Date(),
						value: 50
					}
				)
				.then(function() {
					return capacitor.getPortfolio();
				})
				.then(function(portfolio) {
					portfolio.should.equal(50);
				});
			});
			it('should return 2nd value', function() {
				return Q.ninvoke(DbManager.db.collection('portfolio'), 'insertOne',
					<Portfolio> {
						dateTime: new Date(),
						value: 80
					}
				)
				.then(function() {
					return capacitor.getPortfolio();
				})
				.then(function(portfolio) {
					portfolio.should.equal(80);
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