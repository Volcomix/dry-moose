/// <reference path="../../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var d3 = require('d3');
var ScaleUtils = require('../utils/ScaleUtils');
var ChartBase = require('./ChartBase');
var ChartRow = require('./ChartRow');
var LineSeries = require('./LineSeries');
var PointSeries = require('./PointSeries');
var GainSeries = require('./GainSeries');
var QuotesChart = (function (_super) {
    __extends(QuotesChart, _super);
    function QuotesChart() {
        _super.apply(this, arguments);
        this.yScale = d3.scale.linear();
        this.xQuoteAccessor = function (d) { return d.dateTime; };
        this.yQuoteAccessor = function (d) { return d.close; };
        this.xMAAccessor = function (d) { return d.dateTime; };
        this.yMAAccessor = function (d) { return d.value; };
    }
    QuotesChart.prototype.render = function () {
        ScaleUtils.updateYScale(this.props.monitoringData.quotes, this.xQuoteAccessor, this.yQuoteAccessor, this.props.xScale, this.yScale, this.props.height, QuotesChart.yDomainPadding);
        return (React.createElement(ChartRow, {"title": 'Euro/U.S. Dollar', y: this.props.y, "width": this.props.width, "height": this.props.height, "yScale": this.yScale, "zoom": this.props.zoom, "clipPath": QuotesChart.clipPath, "yTickFormat": QuotesChart.yTickFormat}, React.createElement(LineSeries, {"className": 'mdl-color-text--indigo', "data": this.props.monitoringData.quotes, "xAccessor": this.xQuoteAccessor, "yAccessor": this.yQuoteAccessor, "xScale": this.props.xScale, "yScale": this.yScale, "clipPath": QuotesChart.clipPath}), React.createElement(LineSeries, {"className": 'mdl-color-text--amber', "data": this.props.monitoringData.maCross.fast, "xAccessor": this.xMAAccessor, "yAccessor": this.yMAAccessor, "xScale": this.props.xScale, "yScale": this.yScale, "clipPath": QuotesChart.clipPath}), React.createElement(LineSeries, {"className": 'mdl-color-text--brown', "data": this.props.monitoringData.maCross.slow, "xAccessor": this.xMAAccessor, "yAccessor": this.yMAAccessor, "xScale": this.props.xScale, "yScale": this.yScale, "clipPath": QuotesChart.clipPath}), React.createElement(PointSeries, {"className": 'mdl-color-text--deep-purple', "icon": 'shuffle', "data": this.props.monitoringData.maCross.cross, "xAccessor": this.xMAAccessor, "yAccessor": this.yMAAccessor, "xScale": this.props.xScale, "yScale": this.yScale, "clipPath": QuotesChart.clipPath}), React.createElement(GainSeries, {"gains": this.props.monitoringData.gains, "xScale": this.props.xScale, "yScale": this.yScale, "clipPath": QuotesChart.clipPath})));
    };
    QuotesChart.yTickFormat = d3.format(',.5f');
    QuotesChart.yDomainPadding = 0.1;
    QuotesChart.clipPath = 'clipQuotes';
    return QuotesChart;
})(ChartBase);
module.exports = QuotesChart;
