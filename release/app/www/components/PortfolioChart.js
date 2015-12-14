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
var PortfolioChart = (function (_super) {
    __extends(PortfolioChart, _super);
    function PortfolioChart() {
        _super.apply(this, arguments);
        this.yScale = d3.scale.linear();
        this.xPortfolioAccessor = function (d) { return d.dateTime; };
        this.yPortfolioAccessor = function (d) { return d.value; };
    }
    PortfolioChart.prototype.render = function () {
        ScaleUtils.updateYScale([
            {
                data: this.props.monitoringData.portfolio,
                x: this.xPortfolioAccessor,
                y: [this.yPortfolioAccessor]
            }
        ], this.props.xScale, this.yScale, this.props.height, PortfolioChart.yDomainPadding);
        return (React.createElement(ChartRow, {"title": 'Portfolio', y: this.props.y, "width": this.props.width, "height": this.props.height, "yScale": this.yScale, "zoom": this.props.zoom, "clipPath": PortfolioChart.clipPath, "yTickFormat": PortfolioChart.yTickFormat}, React.createElement(LineSeries, {"className": 'mdl-color-text--orange', "data": this.props.monitoringData.portfolio, "xAccessor": this.xPortfolioAccessor, "yAccessor": this.yPortfolioAccessor, "xScale": this.props.xScale, "yScale": this.yScale, "clipPath": PortfolioChart.clipPath})));
    };
    PortfolioChart.yTickFormat = d3.format(',.2f');
    PortfolioChart.yDomainPadding = 0.2;
    PortfolioChart.clipPath = 'clipPortfolio';
    return PortfolioChart;
})(ChartBase);
module.exports = PortfolioChart;
