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
        
        it('should return no option when not enough quotes', function() {
            var quote: Quote = {
                dateTime: moment('2015-06-01 00:03:00-0500').toDate(),
                open: 1, high: 1, low: 1, close: 1, volume: 0, rewards: rewards
            };
            should.not.exist(processor.process(100, quote, false));
        });
        it('should return a Call when quotes increase', function() {
            var quote: Quote = {
                dateTime: moment('2015-06-01 00:04:00-0500').toDate(),
                open: 1, high: 1, low: 1, close: 3, volume: 0, rewards: rewards
            };
            processor.process(100, quote, false).should.deep.equal(<BinaryOption> {
                quote,
                expiration: new Date('2015-06-01 01:00:00-0500'),
                payout: 0.75,
                amount: 10,
                direction: BinaryOption.Direction.Call
            });
        });
        it('should return a Put when quotes decrease', function() {
            var quote: Quote = {
                dateTime: moment('2015-06-01 00:05:00-0500').toDate(),
                open: 1, high: 1, low: 1, close: 2, volume: 0, rewards: rewards
            };
            processor.process(100, quote, false).should.deep.equal(<BinaryOption> {
                quote,
                expiration: new Date('2015-06-01 01:00:00-0500'),
                payout: 0.75,
                amount: 10,
                direction: BinaryOption.Direction.Put
            });
        });
        it('should return no option when an option is pending', function() {
            var quote: Quote = {
                dateTime: moment('2015-06-01 00:06:00-0500').toDate(),
                open: 1, high: 1, low: 1, close: 3, volume: 0, rewards: rewards
            };
            should.not.exist(processor.process(100, quote, true));
        });
        it('should return no option when quotes are stable', function() {
            var quote: Quote = {
                dateTime: moment('2015-06-01 00:07:00-0500').toDate(),
                open: 1, high: 1, low: 1, close: 3, volume: 0, rewards: rewards
            };
            should.not.exist(processor.process(100, quote, false));
        });
    });
});