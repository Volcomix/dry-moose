/// <reference path="../../../typings/tsd.d.ts" />

import chai = require('chai');
import chaiAsPromised = require("chai-as-promised");
import moment = require('moment');

import GenericASCIIM1 = require('../../collectors/GenericASCIIM1');
import IProcessor = require('../../processors/IProcessor');
import DummyProcessor = require('../../processors/DummyProcessor');
import IInvestor = require('../../investors/IInvestor');
import ForexQuote = require('../../quotes/ForexQuote');
import Reward = require('../../options/Reward');
import IOption = require('../../options/IOption');
import BinaryOption = require('../../options/BinaryOption');

chai.use(chaiAsPromised);
chai.should();

describe('GenericASCIIM1', function() {	
	describe('#collect()', function() {
		
		var rewards: Reward[] = [ new Reward(
			moment({ minutes: 10 }),
			moment({ minutes: 30 }),
			0.75
		) ];
		
		it('should pass quotes to processor', function(done) {
			new GenericASCIIM1(
				{ process: function(quote: ForexQuote, rewards: Reward[]): BinaryOption {
					rewards.should.have.length(1);
					var reward = rewards[0];
					reward.payout.should.equal(0.75);
					switch (this.count) {
						case undefined:
							quote.dateTime.isSame('2015-06-01 00:03:00-0500').should.be.true;
							quote.open.should.equal(1.095090);
							quote.high.should.equal(1.095130);
							quote.low.should.equal(1.095050);
							quote.close.should.equal(1.095060);
							quote.volume.should.equal(0);
							reward.countdown.isSame('2015-06-01 00:50:00-0500').should.be.true;
							reward.expiration.isSame('2015-06-01 01:00:00-0500').should.be.true;
							break;
						case 1:
							quote.dateTime.isSame('2015-06-01 00:04:00-0500').should.be.true;
							quote.open.should.equal(1.095060);
							quote.high.should.equal(1.095060);
							quote.low.should.equal(1.095000);
							quote.close.should.equal(1.095020);
							quote.volume.should.equal(0);
							reward.countdown.isSame('2015-06-01 00:50:00-0500').should.be.true;
							reward.expiration.isSame('2015-06-01 01:00:00-0500').should.be.true;
							break;
						case 2:
							quote.dateTime.isSame('2015-06-01 00:05:00-0500').should.be.true;
							quote.open.should.equal(1.095020);
							quote.high.should.equal(1.095120);
							quote.low.should.equal(1.095020);
							quote.close.should.equal(1.095080);
							quote.volume.should.equal(0);
							reward.countdown.isSame('2015-06-01 00:50:00-0500').should.be.true;
							reward.expiration.isSame('2015-06-01 01:00:00-0500').should.be.true;
							done();
							break;
					}
					this.count = (this.count || 0) + 1;
					return null;
				}},
				{ invest: function(option: IOption) { } },
				'src/test/collectors/GenericASCIIM1.csv',
				rewards
			).run();
		});
		it('should pass actions to investor', function(done) {
			new GenericASCIIM1(
				new DummyProcessor(),
				{ invest: function(option: BinaryOption) {
					switch (this.count) {
						case undefined:
							option.expiration.isSame('2015-06-01 01:00:00-0500').should.be.true;
							option.amount.should.equal(10);
							option.direction.should.equal(BinaryOption.Direction.Put);
							break;
						case 1:
							option.expiration.isSame('2015-06-01 01:00:00-0500').should.be.true;
							option.amount.should.equal(10);
							option.direction.should.equal(BinaryOption.Direction.Call);
							done();
							break;
					}
					this.count = (this.count || 0) + 1;
				}},
				'src/test/collectors/GenericASCIIM1.csv',
				rewards
			).run();
		});
		it('should reject when input file not found', function() {
			return new GenericASCIIM1(
				{ process: function() { return null; } },
				{ invest: function() { } },
				'dummy',
				rewards
			).run().should.be.rejected;
		});
		it('should insert everything into MongoDB');
	});
});