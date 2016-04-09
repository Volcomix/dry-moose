"use strict";
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
var HistoSeries = require('./HistoSeries');
var MACDChart = (function (_super) {
    __extends(MACDChart, _super);
    function MACDChart() {
        _super.apply(this, arguments);
        this.yScale = d3.scale.linear();
        this.xMACDAccessor = function (d) { return d.dateTime; };
        this.yMACDAccessor = function (d) { return d.value; };
        this.yMACDSignalAccessor = function (d) { return d.signal; };
        this.yMACDHistAccessor = function (d) { return d.hist; };
    }
    MACDChart.prototype.render = function () {
        ScaleUtils.updateYScale([
            {
                data: this.props.monitoringData.macd,
                x: this.xMACDAccessor,
                y: [
                    this.yMACDAccessor,
                    this.yMACDSignalAccessor,
                    this.yMACDHistAccessor,
                    function (d) { return 0; }
                ]
            }
        ], this.props.xScale, this.yScale, this.props.height, MACDChart.yDomainPadding);
        return (React.createElement(ChartRow, {title: 'MACD', y: this.props.y, width: this.props.width, height: this.props.height, yScale: this.yScale, zoom: this.props.zoom, clipPath: MACDChart.clipPath, yTickFormat: MACDChart.yTickFormat}, React.createElement(HistoSeries, {className: 'mdl-color-text--pink', data: this.props.monitoringData.macd, xAccessor: this.xMACDAccessor, yAccessor: this.yMACDHistAccessor, xScale: this.props.xScale, yScale: this.yScale, clipPath: MACDChart.clipPath}), React.createElement(LineSeries, {className: 'mdl-color-text--deep-orange', data: this.props.monitoringData.macd, xAccessor: this.xMACDAccessor, yAccessor: this.yMACDSignalAccessor, xScale: this.props.xScale, yScale: this.yScale, clipPath: MACDChart.clipPath}), React.createElement(LineSeries, {className: 'mdl-color-text--blue', data: this.props.monitoringData.macd, xAccessor: this.xMACDAccessor, yAccessor: this.yMACDAccessor, xScale: this.props.xScale, yScale: this.yScale, clipPath: MACDChart.clipPath})));
    };
    MACDChart.yTickFormat = d3.format(',.5f');
    MACDChart.yDomainPadding = 0.2;
    MACDChart.clipPath = 'clipMACD';
    return MACDChart;
}(ChartBase));
module.exports = MACDChart;
