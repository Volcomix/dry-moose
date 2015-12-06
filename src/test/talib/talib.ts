/// <reference path="../../../typings/tsd.d.ts" />

import chai = require('chai');

var talib = require('talib');

chai.should();

describe('talib', function() {
    describe('#SMA', function() {
        it('should return Simple Moving Average', function(done) {
            talib.execute({
                name: 'SMA',
                startIdx: 0,
                endIdx: 4,
                inReal: [1, 2, 3, 4, 5],
                optInTimePeriod: 3
            }, function(result) {
                result.should.deep.equal({
                    begIndex: 2,
                    nbElement: 3,
                    result: { outReal: [2, 3, 4] }
                });
                done();
            });
        });
    });
    describe('#MACD', function() {
        it('should return Moving Average Convergence/Divergence', function(done) {
            talib.execute({
                name: 'MACD',
                startIdx: 0,
                endIdx: 4,
                inReal: [1, 8, 18, 7, 11],
                optInFastPeriod: 2,
                optInSlowPeriod: 3,
                optInSignalPeriod: 2
            }, function(result) {
                result.begIndex.should.equal(3);
                result.nbElement.should.equal(2);
                result.result.outMACD.should.have.length(2);
                result.result.outMACD.should.include(1);
                result.result.outMACDSignal.should.have.length(2);
                result.result.outMACDSignal.should.include(2.5);
                result.result.outMACDHist.should.have.length(2);
                result.result.outMACDHist.should.include(-1.5);
                done();
            });
        });
    });
});