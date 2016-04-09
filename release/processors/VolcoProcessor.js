"use strict";
var moment = require('moment');
var TA = require("../../build/Release/ta-lib");
var BinaryOption = require('../documents/options/BinaryOption');
var VolcoProcessor = (function () {
    function VolcoProcessor(quotesCount, minMinutes, maxMinutes, macdOptions, maCrossOptions) {
        var _this = this;
        this.quotesCount = quotesCount;
        this.minMinutes = minMinutes;
        this.maxMinutes = maxMinutes;
        this.macdOptions = macdOptions;
        this.maCrossOptions = maCrossOptions;
        this.closes = [];
        this.processSteps = function (quote, steps) {
            var stopped = false, quoteIdx = 1, direction;
            function stop() {
                stopped = true;
            }
            for (var stepIdx = 0; !stopped && stepIdx < steps.length; stepIdx++) {
                var step = steps[stepIdx], stepDone = false, changeQuote = true;
                function done(previousQuote) {
                    stepDone = true;
                    changeQuote = previousQuote;
                }
                var stepBegIdx = quoteIdx;
                while (!stopped && !stepDone && quoteIdx <= _this.closes.length) {
                    for (var i = 0; !stopped && !stepDone && i < step.length; i++) {
                        var check = step[i];
                        direction = check.fn(check.data, quoteIdx, stepBegIdx, stop, done);
                    }
                    if (changeQuote) {
                        quoteIdx++;
                    }
                }
            }
            if (direction != undefined) {
                return {
                    quote: quote,
                    expiration: quote.rewards[0].expiration,
                    amount: 10,
                    payout: quote.rewards[0].payout,
                    direction: direction
                };
            }
        };
        this.macdShape = function (macd, i, stepBegIdx, stop, done) {
            var curHist = macd.outMACDHist[macd.outNBElement - i], prevHist = macd.outMACDHist[macd.outNBElement - i - 1], curMacd = macd.outMACD[macd.outNBElement - i], prevMacd = macd.outMACD[macd.outNBElement - i - 1], angleMacd = macd.outMACD[macd.outNBElement - i - 2], histFactor = _this.macdOptions.minHistRaisingFactor, macdFactor = _this.macdOptions.minMACDRaisingFactor;
            if (Math.abs(curHist) < _this.macdOptions.minHistHeight ||
                Math.abs(curHist) > _this.macdOptions.maxHistHeight ||
                Math.abs(curHist) < Math.abs(prevHist) * histFactor ||
                Math.abs(curMacd) < Math.abs(prevMacd) * macdFactor ||
                _this.mathDot(angleMacd, prevMacd, curMacd, _this.macdOptions.angleNormFactor) > _this.macdOptions.angleMaxDotProduct) {
                stop();
            }
            ;
            return;
        };
        this.maCross = function (ma, i, stepBegIdx, stop, done) {
            if (i > _this.maCrossOptions.maxAfterCross) {
                stop();
            }
            var curMaFast = ma.fast.outReal[ma.fast.outNBElement - i], curMaSlow = ma.slow.outReal[ma.slow.outNBElement - i], curMaSign = _this.mathSign(curMaFast - curMaSlow), prevMaFast = ma.fast.outReal[ma.fast.outNBElement - i - 1], prevMaSlow = ma.slow.outReal[ma.slow.outNBElement - i - 1], prevMaSign = _this.mathSign(prevMaFast - prevMaSlow);
            if (curMaSign != prevMaSign) {
                done();
            }
            return;
        };
        this.macdCross = function (macd, i, stepBegIdx, stop, done) {
            if (i > stepBegIdx + _this.macdOptions.maxAfterCross) {
                stop();
            }
            var curHist = macd.outMACDHist[macd.outNBElement - i], prevHist = macd.outMACDHist[macd.outNBElement - i - 1];
            if (_this.mathSign(curHist) == _this.mathSign(prevHist)) {
                return;
            }
            else if (i < stepBegIdx + _this.macdOptions.minAfterCross) {
                stop();
            }
            else {
                done(true);
            }
        };
        this.macdDontCross = function (macd, i, stepBegIdx, stop, done) {
            var curHist = macd.outMACDHist[macd.outNBElement - i], prevHist = macd.outMACDHist[macd.outNBElement - i - 1];
            if (i == stepBegIdx + _this.macdOptions.minBeforeCross) {
                done();
                if (curHist > 0) {
                    return BinaryOption.Direction.Put;
                }
                else {
                    return BinaryOption.Direction.Call;
                }
            }
            if (_this.mathSign(curHist) != _this.mathSign(prevHist)) {
                stop();
            }
        };
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
        return this.processSteps(quote, [
            [
                { fn: this.macdShape, data: macd },
                { fn: this.maCross, data: { fast: maFast, slow: maSlow } }
            ],
            [
                { fn: this.macdShape, data: macd },
                { fn: this.macdCross, data: macd }
            ],
            [
                { fn: this.macdDontCross, data: macd }
            ]
        ]);
    };
    VolcoProcessor.prototype.mathSign = function (x) { return ((x === 0 || isNaN(x)) ? x : (x > 0 ? 1 : -1)); };
    VolcoProcessor.prototype.mathDot = function (p1, p2, p3, factor) {
        var ax = -1 * factor, ay = p1 - p2, bx = 1 * factor, by = p3 - p2, al = Math.sqrt(ax * ax + ay * ay), bl = Math.sqrt(bx * bx + by * by);
        return (ax / al) * (bx / bl) + (ay / al) * (by / bl);
    };
    return VolcoProcessor;
}());
module.exports = VolcoProcessor;
