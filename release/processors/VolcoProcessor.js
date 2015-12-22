/// <reference path="../../typings/tsd.d.ts" />
var moment = require('moment');
var TA = require("../../build/Release/ta-lib");
var BinaryOption = require('../documents/options/BinaryOption');
var VolcoProcessor = (function () {
    function VolcoProcessor(quotesCount, minMinutes, maxMinutes, macdOptions, maCrossOptions) {
        this.quotesCount = quotesCount;
        this.minMinutes = minMinutes;
        this.maxMinutes = maxMinutes;
        this.macdOptions = macdOptions;
        this.maCrossOptions = maCrossOptions;
        this.closes = [];
    }
    VolcoProcessor.prototype.process = function (portfolio, quote, isPendingOption) {
        var dateTime = moment(quote.dateTime);
        if (dateTime.diff(this.lastDateTime, 'minutes') != 1) {
            this.closes = [];
        }
        this.lastDateTime = dateTime;
        this.closes.push(quote.close);
        if (this.closes.length > this.quotesCount) {
            this.closes.shift();
        }
        else {
            return;
        }
        if (isPendingOption)
            return;
        var expiration = moment(quote.rewards[0].expiration).diff(dateTime, 'minutes');
        if (expiration < this.minMinutes || expiration > this.maxMinutes)
            return;
        var macd = TA.MACD(0, this.closes.length - 1, this.closes, this.macdOptions.fastPeriod, this.macdOptions.slowPeriod, this.macdOptions.signalPeriod);
        var maFast = TA.SMA(0, this.closes.length - 1, this.closes, this.maCrossOptions.fastPeriod);
        var maSlow = TA.SMA(0, this.closes.length - 1, this.closes, this.maCrossOptions.slowPeriod);
        var i, step = 1, stepBegIdx = 1;
        for (i = stepBegIdx; i < this.closes.length; i++) {
            var curHist = macd.outMACDHist[macd.outNBElement - i], prevHist = macd.outMACDHist[macd.outNBElement - i - 1];
            /*******************/
            /* Step 1 & 2 MACD */
            /*******************/
            if (step == 1 || step == 2) {
                var curMacd = macd.outMACD[macd.outNBElement - i], prevMacd = macd.outMACD[macd.outNBElement - i - 1], macdFactor = this.macdOptions.minMACDRaisingFactor, histFactor = this.macdOptions.minHistRaisingFactor;
                // => stop
                if (Math.abs(curHist) < this.macdOptions.minHistHeight ||
                    Math.abs(curHist) > this.macdOptions.maxHistHeight ||
                    Math.abs(curHist) < Math.abs(prevHist) * histFactor ||
                    Math.abs(curMacd) < Math.abs(prevMacd) * macdFactor) {
                    return;
                }
                ;
            }
            /******************/
            /* Step 1 MACross */
            /******************/
            if (step == 1) {
                // => stop
                if (i > this.maCrossOptions.maxAfterCross) {
                    return;
                }
                var curMaFast = maFast.outReal[maFast.outNBElement - i], curMaSlow = maSlow.outReal[maSlow.outNBElement - i], curMaSign = this.mathSign(curMaFast - curMaSlow), prevMaFast = maFast.outReal[maFast.outNBElement - i - 1], prevMaSlow = maSlow.outReal[maSlow.outNBElement - i - 1], prevMaSign = this.mathSign(prevMaFast - prevMaSlow);
                // => previous quote
                if (curMaSign == prevMaSign) {
                    continue;
                }
                else {
                    step = 2;
                    stepBegIdx = i;
                }
            }
            /***************/
            /* Step 2 MACD */
            /***************/
            if (step == 2) {
                // => stop
                if (i > stepBegIdx + this.macdOptions.maxAfterCross) {
                    return;
                }
                // => previous quote
                if (this.mathSign(curHist) == this.mathSign(prevHist)) {
                    continue;
                }
                else if (i < stepBegIdx + this.macdOptions.minAfterCross) {
                    return;
                }
                else {
                    step = 3;
                    stepBegIdx = i;
                    continue;
                }
            }
            /***************/
            /* Step 3 MACD */
            /***************/
            if (step == 3) {
                // => done
                if (i == stepBegIdx + this.macdOptions.minBeforeCross) {
                    return {
                        quote: quote,
                        expiration: quote.rewards[0].expiration,
                        amount: 10,
                        payout: quote.rewards[0].payout,
                        direction: curHist > 0 ?
                            BinaryOption.Direction.Put :
                            BinaryOption.Direction.Call
                    };
                }
                // => previous quote
                if (this.mathSign(curHist) == this.mathSign(prevHist)) {
                    continue;
                }
                else {
                    return;
                }
            }
        }
    };
    VolcoProcessor.prototype.mathSign = function (x) { return ((x === 0 || isNaN(x)) ? x : (x > 0 ? 1 : -1)); };
    return VolcoProcessor;
})();
module.exports = VolcoProcessor;
