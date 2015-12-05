/// <reference path="../../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var d3 = require('d3');
var LineSeries = require('./LineSeries');
var GainSeries = require('./GainSeries');
var ChartRow = require('./ChartRow');
var QuotesChart = (function (_super) {
    __extends(QuotesChart, _super);
    function QuotesChart() {
        _super.apply(this, arguments);
        this.xQuoteAccessor = function (d) { return d.dateTime; };
        this.yQuoteAccessor = function (d) { return d.close; };
    }
    QuotesChart.prototype.render = function () {
        return (React.createElement(ChartRow, React.__spread({"title": 'Euro/U.S. Dollar', "clipPath": 'clipQuotes', "yDomainPadding": 0.1, "data": this.props.quotes, "xAccessor": this.xQuoteAccessor, "yAccessor": this.yQuoteAccessor, "yTickFormat": QuotesChart.yTickFormat}, this.props), React.createElement(LineSeries, {"className": 'mdl-color-text--blue', "data": this.props.quotes, "xAccessor": this.xQuoteAccessor, "yAccessor": this.yQuoteAccessor}), React.createElement(GainSeries, {"gains": this.props.gains})));
    };
    QuotesChart.yTickFormat = d3.format(',.5f');
    return QuotesChart;
})(React.Component);
module.exports = QuotesChart;
