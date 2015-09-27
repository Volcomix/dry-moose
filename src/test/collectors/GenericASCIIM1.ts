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
					
					var dateTime = moment(quote.dateTime);
					
					quote.rewards.should.have.length(1);
					var reward = quote.rewards[0];
					var countdown = moment(reward.countdown);
					var expiration = moment(reward.expiration);
					reward.payout.should.equal(0.75);
					
					switch (count) {
						case 0:
							dateTime.isSame('2015-06-01 00:03:00-0500').should.be.true;
							quote.open.should.equal(1.095090);
							quote.high.should.equal(1.095130);
							quote.low.should.equal(1.095050);
							quote.close.should.equal(1.095060);
							quote.volume.should.equal(0);
							countdown.isSame('2015-06-01 00:50:00-0500').should.be.true;
							expiration.isSame('2015-06-01 01:00:00-0500').should.be.true;
							break;
						case 1:
							dateTime.isSame('2015-06-01 00:04:00-0500').should.be.true;
							quote.open.should.equal(1.095060);
							quote.high.should.equal(1.095060);
							quote.low.should.equal(1.095000);
							quote.close.should.equal(1.095020);
							quote.volume.should.equal(0);
							countdown.isSame('2015-06-01 00:50:00-0500').should.be.true;
							expiration.isSame('2015-06-01 01:00:00-0500').should.be.true;
							break;
						case 2:
							dateTime.isSame('2015-06-01 00:05:00-0500').should.be.true;
							quote.open.should.equal(1.095020);
							quote.high.should.equal(1.095120);
							quote.low.should.equal(1.095020);
							quote.close.should.equal(1.095080);
							quote.volume.should.equal(0);
							countdown.isSame('2015-06-01 00:50:00-0500').should.be.true;
							expiration.isSame('2015-06-01 01:00:00-0500').should.be.true;
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