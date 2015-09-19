/// <reference path="../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AbstractProcessor = require('./AbstractProcessor');
var BinaryOption = require('../options/BinaryOption');
var DummyProcessor = (function (_super) {
    __extends(DummyProcessor, _super);
    function DummyProcessor() {
        _super.apply(this, arguments);
    }
    DummyProcessor.prototype.process = function (quote) {
        console.log(quote.dateTime.format() + " => " + quote.close);
        var option;
        if (this.lastQuote && this.lastQuote.close < quote.close) {
            option = BinaryOption.Call;
        }
        else if (this.lastQuote && this.lastQuote.close > quote.close) {
            option = BinaryOption.Put;
        }
        else {
            option = BinaryOption.None;
        }
        this.lastQuote = quote;
        return option;
    };
    return DummyProcessor;
})(AbstractProcessor);
module.exports = DummyProcessor;
