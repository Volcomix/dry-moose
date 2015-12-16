/// <reference path="../../../typings/tsd.d.ts" />
var chai = require('chai');
var TA = require("../../../build/Release/ta-lib");
chai.should();
describe('ta-lib', function () {
    describe('#SMA()', function () {
        it('should return Simple Moving Average', function () {
            var result = TA.SMA(0, 4, [1, 2, 3, 4, 5], 3);
            result.should.deep.equal({
                retCode: 0,
                outBegIdx: 2,
                outNBElement: 3,
                outReal: [2, 3, 4]
            });
        });
    });
    describe('#MACD()', function () {
        it('should return Moving Average Convergence/Divergence', function () {
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
    describe('#BBANDS()', function () {
        it('should return Bollinger Bands', function () {
            var result = TA.BBANDS(0, 4, [1, 8, 18, 7, 11], 2, 2, 2, 0);
            result.should.deep.equal({
                retCode: 0,
                outBegIdx: 1,
                outNBElement: 4,
                outRealUpperBand: [11.5, 23, 23.5, 13],
                outRealMiddleBand: [4.5, 13, 12.5, 9],
                outRealLowerBand: [-2.5, 3, 1.5, 5]
            });
        });
    });
});
