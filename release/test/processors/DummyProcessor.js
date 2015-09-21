/// <reference path="../../../typings/tsd.d.ts" />
var chai = require('chai');
var moment = require('moment');
var DummyProcessor = require('../../processors/DummyProcessor');
var ForexQuote = require('../../quotes/ForexQuote');
var Reward = require('../../options/Reward');
var BinaryOption = require('../../options/BinaryOption');
var should = chai.should();
describe('DummyProcessor', function () {
    var processor = new DummyProcessor();
    describe('#process()', function () {
        var rewards = [new Reward(moment('2015-06-01 00:50:00-0500'), moment('2015-06-01 01:00:00-0500'), 0.75)];
        context('when not enough quotes', function () {
            it('should not return an option', function () {
                var quote = new ForexQuote(moment('2015-06-01 00:03:00-0500'), 1, 1, 1, 1, 0);
                var option = processor.process(quote, rewards);
                should.not.exist(option);
            });
        });
        context('when quotes increase', function () {
            it('should return a Call', function () {
                var quote = new ForexQuote(moment('2015-06-01 00:04:00-0500'), 1, 1, 1, 3, 0);
                var option = processor.process(quote, rewards);
                option.expiration.isSame('2015-06-01 01:00:00-0500').should.be.true;
                option.amount.should.equal(10);
                option.direction.should.equal(BinaryOption.Direction.Call);
            });
        });
        context('when quotes decrease', function () {
            it('should return a Put', function () {
                var quote = new ForexQuote(moment('2015-06-01 00:05:00-0500'), 1, 1, 1, 2, 0);
                var option = processor.process(quote, rewards);
                option.expiration.isSame('2015-06-01 01:00:00-0500').should.be.true;
                option.amount.should.equal(10);
                option.direction.should.equal(BinaryOption.Direction.Put);
            });
        });
        context('when quotes are stable', function () {
            it('should not return an option', function () {
                var quote = new ForexQuote(moment('2015-06-01 00:06:00-0500'), 1, 1, 1, 2, 0);
                var option = processor.process(quote, rewards);
                should.not.exist(option);
            });
        });
    });
});
