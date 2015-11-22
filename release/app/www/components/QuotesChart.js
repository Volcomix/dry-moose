/// <reference path="../../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var d3 = require('d3');
var Chart = require('./Chart');
var GainSeries = require('./GainSeries');
var QuotesChart = (function (_super) {
    __extends(QuotesChart, _super);
    function QuotesChart() {
        _super.apply(this, arguments);
        this.yScale = d3.scale.linear();
        this.xQuoteAccessor = function (d) { return d.dateTime; };
        this.yQuoteAccessor = function (d) { return d.close; };
    }
    QuotesChart.prototype.render = function () {
        return (React.createElement(Chart, {"title": 'Euro/U.S. Dollar', "data": this.props.quotes, "xAccessor": this.xQuoteAccessor, "yAccessor": this.yQuoteAccessor, "width": this.props.width, "height": this.props.height, "margin": this.props.margin, "xScale": this.props.xScale, "yScale": this.yScale, "yTickFormat": QuotesChart.yTickFormat, "clipPath": QuotesChart.clipPath, "zoom": this.props.zoom}, React.createElement(GainSeries, {"gains": this.props.gains, "xScale": this.props.xScale, "yScale": this.yScale, "clipPath": QuotesChart.clipPath})));
    };
    QuotesChart.yTickFormat = d3.format(',.5f');
    QuotesChart.clipPath = 'clipQuotes';
    return QuotesChart;
})(React.Component);
module.exports = QuotesChart;
