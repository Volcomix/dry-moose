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
var BBWChart = (function (_super) {
    __extends(BBWChart, _super);
    function BBWChart() {
        _super.apply(this, arguments);
        this.yScale = d3.scale.linear();
        this.xBBandAccessor = function (d) { return d.dateTime; };
        this.yBandWidthAccessor = function (d) { return d.width; };
    }
    BBWChart.prototype.render = function () {
        ScaleUtils.updateYScale([
            {
                data: this.props.monitoringData.bband,
                x: this.xBBandAccessor,
                y: [this.yBandWidthAccessor]
            }
        ], this.props.xScale, this.yScale, this.props.height, BBWChart.yDomainPadding);
        return (React.createElement(ChartRow, {title: 'Bollinger Bands Width', y: this.props.y, width: this.props.width, height: this.props.height, yScale: this.yScale, zoom: this.props.zoom, clipPath: BBWChart.clipPath, yTickFormat: BBWChart.yTickFormat}, React.createElement(LineSeries, {className: 'mdl-color-text--teal', data: this.props.monitoringData.bband, xAccessor: this.xBBandAccessor, yAccessor: this.yBandWidthAccessor, xScale: this.props.xScale, yScale: this.yScale, clipPath: BBWChart.clipPath})));
    };
    BBWChart.yTickFormat = d3.format(',.5f');
    BBWChart.yDomainPadding = 0.2;
    BBWChart.clipPath = 'clipBBW';
    return BBWChart;
}(ChartBase));
module.exports = BBWChart;
