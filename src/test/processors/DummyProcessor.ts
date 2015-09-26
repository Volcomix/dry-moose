/// <reference path="../../../typings/tsd.d.ts" />

import chai = require('chai');
import moment = require('moment');

import DummyProcessor = require('../../processors/DummyProcessor');
import Quote = require('../../documents/Quote');
import Reward = require('../../documents/Reward');
import BinaryOption = require('../../documents/options/BinaryOption');

var should = chai.should();

describe('DummyProcessor', function() {
    var processor = new DummyProcessor();
    
    describe('#process()', function() {
        
        var rewards: Reward[] = [{
			countdown: moment('2015-06-01 00:50:00-0500').toDate(),
			expiration: moment('2015-06-01 01:00:00-0500').toDate(),
			payout: 0.75
        }];
        
        context('when not enough quotes', function() {
            it('should not return an option', function() {
                var quote: Quote = {
                    dateTime: moment('2015-06-01 00:03:00-0500').toDate(),
                    open: 1,
                    high: 1,
                    low: 1,
                    close: 1,
                    volume: 0
                };
                var option = processor.process(100, quote, rewards);
                should.not.exist(option);                
            });
        });
        context('when quotes increase', function() {
            it('should return a Call', function() {
                var quote: Quote = {
                    dateTime: moment('2015-06-01 00:04:00-0500').toDate(),
                    open: 1,
                    high: 1,
                    low: 1,
                    close: 3,
                    volume: 0
                };
                var option = processor.process(100, quote, rewards);
                moment(option.expiration).isSame('2015-06-01 01:00:00-0500').should.be.true;
                option.amount.should.equal(10);
                option.direction.should.equal(BinaryOption.Direction.Call);
            });
        });
        context('when quotes decrease', function() {
            it('should return a Put', function() {
                var quote: Quote = {
                    dateTime: moment('2015-06-01 00:05:00-0500').toDate(),
                    open: 1,
                    high: 1,
                    low: 1,
                    close: 2,
                    volume: 0
                };
                var option = processor.process(100, quote, rewards);
                moment(option.expiration).isSame('2015-06-01 01:00:00-0500').should.be.true;
                option.amount.should.equal(10);
                option.direction.should.equal(BinaryOption.Direction.Put);
            });
        });
        context('when quotes are stable', function() {
            it('should not return an option', function() {
                var quote: Quote = {
                    dateTime: moment('2015-06-01 00:06:00-0500').toDate(),
                    open: 1,
                    high: 1,
                    low: 1,
                    close: 2,
                    volume: 0
                };
                var option = processor.process(100, quote, rewards);
                should.not.exist(option);                
            });
        });
    })
});