/// <reference path="../../../typings/tsd.d.ts" />
var chai = require('chai');
var moment = require('moment');
var DummyProcessor = require('../../processors/DummyProcessor');
var ForexQuote = require('../../quotes/ForexQuote');
var BinaryOption = require('../../options/BinaryOption');
chai.should();
describe('DummyProcessor', function () {
    var processor = new DummyProcessor();
    describe('#process()', function () {
        context('when not enough quotes', function () {
            it('should return a None', function () {
                var quote = new ForexQuote(moment(), 1, 1, 1, 1, 0);
                processor.process(quote).should.equal(BinaryOption.None);
            });
        });
        context('when quotes increase', function () {
            it('should return a Call', function () {
                var quote = new ForexQuote(moment(), 1, 1, 1, 2, 0);
                processor.process(quote).should.equal(BinaryOption.Call);
            });
        });
        context('when quotes decrease', function () {
            it('should return a Put', function () {
                var quote = new ForexQuote(moment(), 1, 1, 1, 1.5, 0);
                processor.process(quote).should.equal(BinaryOption.Put);
            });
        });
        context('when quotes are stable', function () {
            it('should return a None', function () {
                var quote = new ForexQuote(moment(), 1, 1, 1, 1.5, 0);
                processor.process(quote).should.equal(BinaryOption.None);
            });
        });
    });
});
