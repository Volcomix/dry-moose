/// <reference path="../../typings/tsd.d.ts" />
var chai = require('chai');
var TA = require("../../build/Release/ta-lib");
chai.should();
describe('ta-lib', function () {
    describe('#SMA()', function () {
        it('should return Simple Moving Average', function (done) {
            TA.SMA(0, 4, [1, 2, 3, 4, 5], 3, function (outBegIdx, outNBElement, outReal) {
                outBegIdx.should.equal(2);
                outNBElement.should.equal(3);
                outReal.should.have.length(3);
                outReal.should.have.members([2, 3, 4]);
                done();
            });
        });
    });
});
