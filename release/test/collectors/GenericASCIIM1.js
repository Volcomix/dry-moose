/// <reference path="../../../typings/tsd.d.ts" />
var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
var moment = require('moment');
var GenericASCIIM1 = require('../../collectors/GenericASCIIM1');
var DummyProcessor = require('../../processors/DummyProcessor');
var BinaryOption = require('../../options/BinaryOption');
chai.use(chaiAsPromised);
chai.should();
describe('GenericASCIIM1', function () {
    describe('#collect()', function () {
        var rewards = [{
                expiration: moment({ minutes: 30 }),
                payout: 0.75
            }];
        it('should pass quotes to processor', function () {
            return new GenericASCIIM1({ process: function (quote, rewards) {
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
                            reward.expiration.minutes().should.equal(33);
                            break;
                        case 1:
                            quote.dateTime.isSame('2015-06-01 00:04:00-0500').should.be.true;
                            quote.open.should.equal(1.095060);
                            quote.high.should.equal(1.095060);
                            quote.low.should.equal(1.095000);
                            quote.close.should.equal(1.095020);
                            quote.volume.should.equal(0);
                            reward.expiration.minutes().should.equal(34);
                            break;
                        case 2:
                            quote.dateTime.isSame('2015-06-01 00:05:00-0500').should.be.true;
                            quote.open.should.equal(1.095020);
                            quote.high.should.equal(1.095120);
                            quote.low.should.equal(1.095020);
                            quote.close.should.equal(1.095080);
                            quote.volume.should.equal(0);
                            reward.expiration.minutes().should.equal(35);
                            break;
                    }
                    this.count = (this.count || 0) + 1;
                    return null;
                } }, { invest: function (option) { } }, 'src/test/collectors/GenericASCIIM1.csv', rewards).collect();
        });
        it('should pass actions to investor', function () {
            return new GenericASCIIM1(new DummyProcessor(), { invest: function (option) {
                    switch (this.count) {
                        case undefined:
                            option.expiration.isSame('2015-06-01 00:34:00-0500').should.be.true;
                            option.amount.should.equal(10);
                            option.direction.should.equal(BinaryOption.Direction.Put);
                            break;
                        case 1:
                            option.expiration.isSame('2015-06-01 00:35:00-0500').should.be.true;
                            option.amount.should.equal(10);
                            option.direction.should.equal(BinaryOption.Direction.Call);
                            break;
                    }
                    this.count = (this.count || 0) + 1;
                } }, 'src/test/collectors/GenericASCIIM1.csv', rewards).collect();
        });
        it('should reject when input file not found', function () {
            return new GenericASCIIM1({ process: function () { return null; } }, { invest: function () { } }, 'dummy', rewards).collect().should.be.rejected;
        });
    });
});
