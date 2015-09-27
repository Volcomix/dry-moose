/// <reference path="../../../typings/tsd.d.ts" />
var chai = require('chai');
var moment = require('moment');
var DummyProcessor = require('../../processors/DummyProcessor');
var BinaryOption = require('../../documents/options/BinaryOption');
var should = chai.should();
describe('DummyProcessor', function () {
    var processor = new DummyProcessor();
    describe('#process()', function () {
        var rewards = [{
                countdown: moment('2015-06-01 00:50:00-0500').toDate(),
                expiration: moment('2015-06-01 01:00:00-0500').toDate(),
                payout: 0.75
            }];
        it('should return no option when not enough quotes', function () {
            var quote = {
                dateTime: moment('2015-06-01 00:03:00-0500').toDate(),
                open: 1, high: 1, low: 1, close: 1, volume: 0, rewards: rewards
            };
            var option = processor.process(100, quote);
            should.not.exist(option);
        });
        it('should return a Call when quotes increase', function () {
            var quote = {
                dateTime: moment('2015-06-01 00:04:00-0500').toDate(),
                open: 1, high: 1, low: 1, close: 3, volume: 0, rewards: rewards
            };
            var option = processor.process(100, quote);
            moment(option.expiration).isSame('2015-06-01 01:00:00-0500').should.be.true;
            option.amount.should.equal(10);
            option.direction.should.equal(BinaryOption.Direction.Call);
        });
        it('should return a Put when quotes decrease', function () {
            var quote = {
                dateTime: moment('2015-06-01 00:05:00-0500').toDate(),
                open: 1, high: 1, low: 1, close: 2, volume: 0, rewards: rewards
            };
            var option = processor.process(100, quote);
            moment(option.expiration).isSame('2015-06-01 01:00:00-0500').should.be.true;
            option.amount.should.equal(10);
            option.direction.should.equal(BinaryOption.Direction.Put);
        });
        it('should return no option when quotes are stable', function () {
            var quote = {
                dateTime: moment('2015-06-01 00:06:00-0500').toDate(),
                open: 1, high: 1, low: 1, close: 2, volume: 0, rewards: rewards
            };
            var option = processor.process(100, quote);
            should.not.exist(option);
        });
    });
});
