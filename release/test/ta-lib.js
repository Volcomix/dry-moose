/// <reference path="../../typings/tsd.d.ts" />
require('chai').should();
var TA = require("../../build/Release/ta-lib");
describe('ta-lib', function () {
    describe('#SMA()', function () {
        it('should return Simple Moving Average', function (done) {
            var inReal = [];
            for (var i = 0; i < 10; i++) {
                inReal[i] = Math.floor(Math.random() * 50);
            }
            TA.SMA(0, inReal.length - 1, inReal, 3, function (outBegIdx, outNBElement, outReal) {
                var i;
                for (i = 0; i < outBegIdx; i++) {
                }
                for (i = 0; i < outNBElement; i++) {
                }
                outReal.should.have.length(8);
                done();
            });
        });
    });
});
