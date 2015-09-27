/// <reference path="../../../typings/tsd.d.ts" />

import chai = require('chai');
import chaiAsPromised = require("chai-as-promised");
import Q = require('q');
import moment = require('moment');

import GenericASCIIM1 = require('../../collectors/GenericASCIIM1');
import Reward = require('../../documents/Reward');
import Quote = require('../../documents/Quote');

chai.use(chaiAsPromised);
chai.should();

describe('GenericASCIIM1', function() {	
	describe('#collect()', function() {
		
		var rewards: Reward[] = [{
			countdown: moment({ minutes: 10 }).toDate(),
			expiration: moment({ minutes: 30 }).toDate(),
			payout: 0.75
		}];
		
		it('should reject when input file not found', function() {
			return new GenericASCIIM1('dummy', rewards).collect().should.be.rejected;
		});
		
		it('should collect quotes', function() {
			var count = 0;
			var inProgress = Q<void>(null);
			return new GenericASCIIM1('src/test/collectors/GenericASCIIM1.csv', rewards)
			.collect()
			.progress(function(quote: Quote) {
				inProgress = inProgress.then(function() {
					switch (count) {
						case 0:
							quote.should.deep.equal(<Quote> {
								dateTime: new Date('2015-06-01 00:03:00-0500'),
								open: 1.095090, high: 1.095130,
								low: 1.095050, close: 1.095060,
								volume: 0,
								rewards: [{
									countdown: new Date('2015-06-01 00:50:00-0500'),
									expiration: new Date('2015-06-01 01:00:00-0500'),
									payout: 0.75,
								}]
							});
							break;
						case 1:
							quote.should.deep.equal(<Quote> {
								dateTime: new Date('2015-06-01 00:04:00-0500'),
								open: 1.095060, high: 1.095060,
								low: 1.095000, close: 1.095020,
								volume: 0,
								rewards: [{
									countdown: new Date('2015-06-01 00:50:00-0500'),
									expiration: new Date('2015-06-01 01:00:00-0500'),
									payout: 0.75,
								}]
							});
							break;
						case 2:
							quote.should.deep.equal(<Quote> {
								dateTime: new Date('2015-06-01 00:05:00-0500'),
								open: 1.095020, high: 1.095120,
								low: 1.095020, close: 1.095080,
								volume: 0,
								rewards: [{
									countdown: new Date('2015-06-01 00:50:00-0500'),
									expiration: new Date('2015-06-01 01:00:00-0500'),
									payout: 0.75,
								}]
							});
							break;
					}
					count++;
				});
			})
			.then(function() {
				return inProgress.then(function() {
					count.should.equal(3);
				});
			});
		});
	});
});