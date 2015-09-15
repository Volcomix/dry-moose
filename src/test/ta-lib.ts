/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../addon/ta-lib.d.ts" />

require('chai').should();

import TA = require('../../build/Release/ta-lib');

describe('ta-lib', function() {
    describe('#SMA()', function() {
        it('should return Simple Moving Average', function(done) {
            var inReal = [];
            
            for (var i = 0; i < 10; i++) {
                inReal[i] = Math.floor(Math.random() * 50);
            }
            
            TA.SMA(0, inReal.length - 1, inReal, 3,
                function(outBegIdx: number, outNBElement: number, outReal: number[]) {
                    var i;
                    for (i = 0; i < outBegIdx; i++) {
                        // console.log('Day ' + i + ': ' + inReal[i]);
                    }
                    for (i = 0; i < outNBElement; i++) {
                        // console.log('Day ' + (outBegIdx + i) + ': ' +
                        //             inReal[outBegIdx + i] + ' -> ' + outReal[i].toFixed(2));
                    }
                    
                    outReal.should.have.length(8);
                    done();
                });
        });
    });
});