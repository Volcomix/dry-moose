/// <reference path="../../../typings/tsd.d.ts" />

import chai = require('chai');
import mongodb = require('mongodb');
import Q = require('q');

import DbManager = require('../../database/DbManager');
import ICapacitor = require('../../capacitors/ICapacitor');
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
		context('when database contains 1 value', function() {
			before(function() {
				return Q.ninvoke(DbManager.db.collection('portfolio'), 'insertOne',
					<Portfolio> {
						dateTime: new Date(),
						value: 50
					}
				);
			});
			it('should return this value', function() {
				return capacitor.getPortfolio()
				.then(function(portfolio) {
					portfolio.should.equal(50);
				});
			});
		});
		context('when database contains 2 values', function() {
			before(function() {
				return Q.ninvoke(DbManager.db.collection('portfolio'), 'insertOne',
					<Portfolio> {
						dateTime: new Date(),
						value: 80
					}
				);
			});
			it('should return last value', function() {
				return capacitor.getPortfolio()
				.then(function(portfolio) {
					portfolio.should.equal(80);
				});
			});
		});
	});
	
	after(function() {
		return Q.ninvoke(DbManager.db, 'dropDatabase')
		.then(function() {
			return DbManager.db.close();
		});
	});
});