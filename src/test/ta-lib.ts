/// <reference path="../../typings/tsd.d.ts" />

import chai = require('chai')

import TA = require('ta-lib');

chai.should();

describe('ta-lib', function() {
    describe('#SMA()', function() {
        it('should return Simple Moving Average', function() {
            var result = TA.SMA(0, 4, [1, 2, 3, 4, 5], 3);
            result.retCode.should.equal(0);
            result.outBegIdx.should.equal(2);
            result.outNBElement.should.equal(3);
            result.outReal.should.have.length(3);
            result.outReal.should.have.members([2, 3, 4]);
        });
    });
    describe('#MACD()', function() {
        it('should return Moving Average Convergence/Divergence', function() {
            var result = TA.MACD(0, 4, [1, 8, 18, 7, 11], 2, 3, 2);
            result.retCode.should.equal(0);
            result.outBegIdx.should.equal(3);
            result.outNBElement.should.equal(2);
            result.outMACD.should.have.length(2);
            result.outMACD.should.include(1);
            result.outMACDSignal.should.have.length(2);
            result.outMACDSignal.should.include(2.5);
            result.outMACDHist.should.have.length(2);
            result.outMACDHist.should.include(-1.5);
        });
    });
});