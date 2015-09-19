/// <reference path="../../../typings/tsd.d.ts" />

import chai = require('chai');
import moment = require('moment');

import DummyProcessor = require('../../processors/DummyProcessor');
import ForexQuote = require('../../quotes/ForexQuote');
import Reward = require('../../options/Reward');
import BinaryOption = require('../../options/BinaryOption');

var should = chai.should();

describe('DummyProcessor', function() {
    var processor = new DummyProcessor();
    
    describe('#process()', function() {
        
        var rewards: Reward[] = [{
                expiration: moment().add({ minutes: 30 }),
                payout: 0.75
        }];
        
        context('when not enough quotes', function() {
            it('should not return an option', function() {
                var quote = new ForexQuote(moment(), 1, 1, 1, 1, 0);
                var option = processor.process(quote, rewards);
                should.not.exist(option);                
            });
        });
        context('when quotes increase', function() {
            it('should return a Call', function() {
                var quote = new ForexQuote(moment(), 1, 1, 1, 2, 0);
                var option = processor.process(quote, rewards);
                option.expiration.should.equal(rewards[0].expiration);
                option.amount.should.equal(10);
                option.direction.should.equal(BinaryOption.Direction.Call);
            });
        });
        context('when quotes decrease', function() {
            it('should return a Put', function() {
                var quote = new ForexQuote(moment(), 1, 1, 1, 1.5, 0);
                var option = processor.process(quote, rewards);
                option.expiration.should.equal(rewards[0].expiration);
                option.amount.should.equal(10);
                option.direction.should.equal(BinaryOption.Direction.Put);
            });
        });
        context('when quotes are stable', function() {
            it('should not return an option', function() {
                var quote = new ForexQuote(moment(), 1, 1, 1, 1.5, 0);
                var option = processor.process(quote, rewards);
                should.not.exist(option);                
            });
        });
    })
});