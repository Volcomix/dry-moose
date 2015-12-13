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
var MACrossChart = (function (_super) {
    __extends(MACrossChart, _super);
    function MACrossChart() {
        _super.apply(this, arguments);
        this.yScale = d3.scale.linear();
        this.xMAAccessor = function (d) { return d.dateTime; };
        this.yMAAccessor = function (d) { return d.value; };
    }
    MACrossChart.prototype.render = function () {
        ScaleUtils.updateYScale(this.props.monitoringData.maCross.fast, this.xMAAccessor, this.yMAAccessor, this.props.xScale, this.yScale, this.props.height, MACrossChart.yDomainPadding);
        return (React.createElement(ChartRow, {"title": 'Moving Average Cross', y: this.props.y, "width": this.props.width, "height": this.props.height, "yScale": this.yScale, "zoom": this.props.zoom, "clipPath": MACrossChart.clipPath, "yTickFormat": MACrossChart.yTickFormat}, React.createElement(LineSeries, {"className": 'mdl-color-text--red', "data": this.props.monitoringData.maCross.fast, "xAccessor": this.xMAAccessor, "yAccessor": this.yMAAccessor, "xScale": this.props.xScale, "yScale": this.yScale, "clipPath": MACrossChart.clipPath}), React.createElement(LineSeries, {"className": 'mdl-color-text--green', "data": this.props.monitoringData.maCross.slow, "xAccessor": this.xMAAccessor, "yAccessor": this.yMAAccessor, "xScale": this.props.xScale, "yScale": this.yScale, "clipPath": MACrossChart.clipPath}), React.createElement(PointSeries, {"className": 'mdl-color-text--indigo', "icon": 'shuffle', "data": this.props.monitoringData.maCross.cross, "xAccessor": this.xMAAccessor, "yAccessor": this.yMAAccessor, "xScale": this.props.xScale, "yScale": this.yScale, "clipPath": MACrossChart.clipPath})));
    };
    MACrossChart.yTickFormat = d3.format(',.5f');
    MACrossChart.yDomainPadding = 0.2;
    MACrossChart.clipPath = 'clipMACross';
    return MACrossChart;
})(ChartBase);
module.exports = MACrossChart;
